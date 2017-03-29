// Run the following command in the terminal to get started:
// npm install --save-dev gulp gulp-sass gulp-useref gulp-if gulp-babel-minify gulp-cssnano run-sequence gulp-replace pump del fs gulp-shell gulp-concat gulp-json-editor gulp-rename

const gulp = require('gulp');
const sass = require('gulp-sass');
const useref = require('gulp-useref');
const gulpIf = require('gulp-if');
const minify = require('gulp-babel-minify');
const cssnano = require('gulp-cssnano');
const runSequence = require('run-sequence');
const replace = require('gulp-replace');
const pump = require('pump');
const del = require('del');
const fs = require('fs');
const shell = require('gulp-shell');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const jsonEdit = require('gulp-json-editor');
const bower = require('main-bower-files');
const svg2png = require('gulp-svg2png');


// Size in pixels in which to generate app icon PNG files
const mainIconBaseFilename = 'ext_icon';
const primaryIconSize = 48;
const iconSizes = [16, 32, 48, 96, 128];
let messages = JSON.parse(fs.readFileSync('./app/_locales/en/messages.json', 'utf8'));
const manifest = JSON.parse(fs.readFileSync('./app/manifest.json'));



gulp.task('default', function() {
    runSequence('sass', 'debug:clean', 'debug:build', 'watch');
});

gulp.task('sass', function(cb) {
    pump([
        gulp.src('app/scss/**/*.scss'),
        sass(),
        gulp.dest('app/css')
    ], cb);
});

gulp.task('bower', function() {
    pump([
        gulp.src(bower()),
        gulp.dest('app/js/lib/')
    ]);
});




/**
 * DEBUGGING
 */

gulp.task('watch', ['sass'], function() {
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch(['app/**/*', '!app/scss/**/*.scss', '!app/scss', '!gulpfile.js'], ['debug:build']);
});

gulp.task('debug:clean', function() {
    return del.sync(['debug']);
});

gulp.task('debug:build', function(cb) {
    messages = JSON.parse(fs.readFileSync('./app/_locales/en/messages.json', 'utf8'));
    runSequence('bower');
    pump([
        gulp.src(['app/**/*', '!app/scss/', '!app/scss/**']),
        gulpIf('*.html', replace(/[{]{3}([\w]+)[}]{3}/ig, getMessage)),
        gulp.dest('debug/')
    ], cb);
    runSequence('reloadChrome');
});

gulp.task('debug', function() {
    runSequence('debug:clean', 'debug:build');
});

// Reloads the extension in Chrome
gulp.task('reloadChrome', shell.task([
    '"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe" http://reload.extensions/'
]));




/**
 * PRODUCTION
 */

// Delete any existing files from a previous build
gulp.task('production:clean', function() {
   return del.sync(['production']);
});

// Generate png versions of the app icon in various sizes
gulp.task('production:svg2png_ext_icon', function() {
    for (let i = 0; i < iconSizes.length; i++) {
        const size = iconSizes[i];
        pump([
            gulp.src('app/images/branding/' + mainIconBaseFilename + '.svg'),
            svg2png({width:size, height:size}, true, null),
            rename(function(path) {
                path.basename += '-' + size;
            }),
            gulp.dest('production/images/branding')
        ]);
    }
});

gulp.task('production:svg2png_other_icons', function() {
    pump([
        gulp.src('app/images/icons/**/*.svg'),
        svg2png({width: primaryIconSize, height:primaryIconSize}),
        gulp.dest('production/images/icons')
    ])
});

// Compress content scripts into a single minified file
gulp.task('production:content_js', function(cb) {
    const paths = manifest.content_scripts[0].js;
    for (let i = 0; i < paths.length; i++) {
        paths[i] = 'app/' + paths[i];
    }
    pump([
        gulp.src(paths),
        concat('content.min.js'),
        minify(),
        gulp.dest('production/js/')
    ], cb)
});

// Compress background scripts into a single minified file
gulp.task('production:background_js', function(cb) {
    const paths = manifest.background.scripts;
    for (let i = 0; i < paths.length; i++) {
        paths[i] = 'app/' + paths[i];
    }
    pump([
        gulp.src(paths),
        concat('background.min.js'),
        minify(),
        gulp.dest('production/js/')
    ], cb)
});

// Minify additional scripts that aren't referenced
// in HTML so aren't already handled by useref()
gulp.task('production:css', function(cb) {
    pump([
        gulp.src(['app/css/colors-day.css', 'app/css/colors-night.css']),
        cssnano(),
        rename(function(path) {
            path.extname = '.min.css'
        }),
        gulp.dest('production/css/')
    ], cb);
});

// Minify language resource JSON files
gulp.task('production:languages', function(cb) {
    pump([
        gulp.src('app/_locales/*/**.json'),
        replace(/[ ]{2,}/g, ''), // Remove unnecessary spaces
        replace(/([\r\n]+)/g, ''), // Remove empty lines
        gulp.dest('production/_locales/')
    ], cb);
});

// Minify manifest and change the content_scripts list
// to reflect the changes from production:content_js
// (Replaces the list of files with the single minified filename)
gulp.task('production:manifest', function(cb) {
    pump([
        gulp.src('app/manifest.json'),
        jsonEdit(function(json) {
            json.background.scripts = ['js/background.min.js'];
            json.content_scripts[0].js = ['js/content.min.js'];

            const icons = {};
            for (let i = 0; i < iconSizes.length; i++) {
                const size = iconSizes[i];
                icons['' + size] = 'images/branding/' + mainIconBaseFilename + '-' + size + '.png';
            }
            json.icons = icons;
            
            return json;
        }),
        replace(/[ ]{2,}/g, ''), // Remove unnecessary spaces
        replace(/([\r\n]+)/g, ''), // Remove empty lines
        gulp.dest('production/')
    ], cb);
});

gulp.task('production', function(cb) {
    messages = JSON.parse(fs.readFileSync('./app/_locales/en/messages.json', 'utf8'));
    runSequence(
        [
            'production:clean',
            'sass',
            'bower'
        ],
        [
            'production:svg2png_ext_icon',
            'production:svg2png_other_icons',
            'production:content_js',
            'production:background_js',
            'production:css',
            'production:languages',
            'production:manifest'
        ]
    );

    // Construct and minify HTML and related files
    // This includes any JS and CSS that are referenced
    // from those files.
    // HTML files have most whitespace stripped but new
    // lines are maintained while removing empty lines
    pump([
        gulp.src('app/**/*.html'),
        useref(),
        gulpIf('*.js', replace(/css\/colors-(day|night)\.css+/g, 'css/colors-$1.min.css')),
        gulpIf('*.js', minify()),
        gulpIf('*.css', cssnano()),
        replace(/[ ]{2,}/g, ''), // Remove unnecessary spaces
        replace(/(\r\n){2,}/g, '\r\n'), // Remove empty lines
        replace(/[{]{3}([\w]+)[}]{3}/ig, getMessage), // Insert messages from resource file
        gulp.dest('production/')
    ], cb);
});


/**
 * UTILITY FUNCTIONS
 */

function getMessage(match, key) {
    try {
        return messages[key]['message'];
    }
    catch (e) {
        console.log('ERROR: Incorrect key "' + key + '". Please check messages.json and html files to verify variable formatting.');
    }
}