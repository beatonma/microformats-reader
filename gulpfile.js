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

var messages = JSON.parse(fs.readFileSync('./app/_locales/en/messages.json', 'utf8'));
var manifest = JSON.parse(fs.readFileSync('./app/manifest.json'));


gulp.task('default', function() {
    runSequence('sass', 'debug:clean', 'debug:build', 'watch');
});

gulp.task('watch', ['sass'], function() {
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch(['app/**/*', '!app/scss/**/*.scss', '!app/scss', '!gulpfile.js'], ['debug:build']);
});

gulp.task('sass', function(cb) {
    pump([
        gulp.src('app/scss/**/*.scss'),
        sass(),
        gulp.dest('app/css')
    ], cb);
});

gulp.task('clean', function() {
   return del.sync(['production']);
});

gulp.task('debug:clean', function() {
    return del.sync(['debug']);
});

gulp.task('build:options', function() {
    pump([
        gulp.src('app/**/*.html'),
        useref(),
        gulpIf('*.js', minify()),
        gulpIf('*.css', cssnano()),
        replace(/[ ]{2,}/g, ''),
        replace(/(\r\n){2,}/g, '\r\n'),
        replace(/[{]{3}([\w]+)[}]{3}/ig, getMessage),
        gulp.dest('production/')
    ]);
});

gulp.task('build:json', function() {
    pump([
        gulp.src(['app/_locales/**/*.json']),
        gulp.dest('production/_locales')
    ])
});

gulp.task('build:js', function() {
    var paths = manifest.content_scripts[0].js;
    for (let i = 0; i < paths.length; i++) {
        paths[i] = 'app/' + paths[i];
    }
    pump([
        gulp.src(paths),
        concat('app.min.js'),
        minify(),
        gulp.dest('production/js/')
    ])
});

gulp.task('build:bower', function() {
    pump([
        gulp.src(bower()),
        gulp.dest('production/js/lib/')
    ]);
});

gulp.task('debug:bower', function() {
    pump([
        gulp.src(bower()),
        gulp.dest('app/js/lib/')
    ]);
});

gulp.task('build:css', function() {
    pump([
        gulp.src(['app/css/overlay.css', 'app/css/colors-day.css', 'app/css/colors-night.css']),
        cssnano(),
        rename(function(path) {
            path.extname = '.min.css'
        }),
        gulp.dest('production/css/')
    ]);
});

gulp.task('build:image', function() {
    pump([
        gulp.src('app/image/**.*'),
        gulp.dest('production/image/')
    ]);
});

gulp.task('build:manifest', function() {
    pump([
        gulp.src('app/manifest.json'),
        jsonEdit(function(json) {
            json.content_scripts[0].js = ['js/app.min.js'];
            json.content_scripts[0].css = ['css/overlay.min.css'];
            return json;
        }),
        gulp.dest('production/')
    ])
});

gulp.task('build', function() {
    runSequence(
        'clean',
        'build:options',
        ['build:json', 'build:image', 'build:js', 'build:css'],
        'build:manifest');
});

gulp.task('debug:build', function(cb) {
    messages = JSON.parse(fs.readFileSync('./app/_locales/en/messages.json', 'utf8'));
    runSequence('debug:bower');
    pump([
        gulp.src(['app/**/*', '!app/scss/', '!app/scss/**']),
        gulpIf('*.html', replace(/[{]{3}([\w]+)[}]{3}/ig, getMessage)),
        gulp.dest('debug/')
    ], cb);
    runSequence('reloadChrome');
});

gulp.task('debug', function() {
    runSequence('debug:clean', 'debug:build');
})

// Reloads the extension in Chrome
gulp.task('reloadChrome', shell.task([
    '"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe" http://reload.extensions/'
]));

function getMessage(match, key) {
    try {
        return messages[key]['message'];
    }
    catch (e) {
        console.log('ERROR: Incorrect key "' + key + '". Please check messages.json and html files to verify variable formatting.');
//        throw e;
    }
}