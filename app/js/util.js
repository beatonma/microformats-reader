function replaceClass(el, remove, add) {
    el.removeClass(remove).addClass(add);
}

function getMessage(key) {
    let message =  chrome.i18n.getMessage(key);
    // console.log(format('getMessage({}) -> "{}"', key, message));
    if (message == 'undefined') {
        console.log('Could not get message for key=' + key);
        return key;
    }
    return message;
}

function linkify(obj, text=null) {
    try {
        return obj.replace(
            /\s*(mailto:([^\s<>]+)|(\w+:\/\/[^\s<>]+)|(\s*(sms:([^\s<>]+))))/g,
            format('<a href="$1">{}</a>', (text || '$2$3$4'))
        );
    }
    catch(e) {
        // obj is not a String
        return obj;
    }
}

function makeHtmlId(text) {
    // return String(text).replace(/[\s/?#.-]+/g, '-').slice(0, 15);
    return String(text).replace(/[^\w]+/g, '-').slice(0, 15);
}

function getMapsUrl(query) {
    let url = 'https://www.google.com/maps/search/' + String(query).replace(/[\s]+/g, '+');
    console.log(format('getMapsUrl("{}") -> "{}"', query, url));
    return url;
}

// Calculate the age of someone given their birthday in yyyy-mm-dd format
function yearsSince(date) {
    try {
        let then = new Date(date);
        let now = new Date();

        let diffMillis = now.getTime() - then.getTime();
        let years = diffMillis / (1000*60*60*24*365);
        return Math.floor(years);
    }
    catch(e) {
        console.log('could not parse date "' + date + '": ' + e);
    }

    return date;
}

// function loadOptions(cb) {
//     chrome.storage.sync.get({
//         enabled: true,
//         preview_rate: 0.1,
//         ignore_smallerthan_px: 32,
//         domain_policy: 0,
//         domain_whitelist: 'example.com, example.org',
//         domain_blacklist: 'example.com, example.org'
//     }, cb);
// }

// /**
//  * Checks if the current domain trusting by matching it against
//  * blacklist or whitelist, depending on user's choice of domain policy.
//  * items: the options passed to the callback from loadOptions()
//  */
// function domainTrusted(items) {
//     const domainPolicy = items.domain_policy;
//     if (domainPolicy == 0) {
//         const whitelist = items.domain_whitelist;
//         const parts = whitelist.split(/[, ]+/);
        
//         for (let i=0; i < parts.length; i++) {
//             const query = '^' + parts[i].replace(/[.]+/g, '\\.').replace(/([*]+)/g, '[\\w]+') + '$';
//             let result = location.hostname.match(query);
//             if (result != null) {
//                 return true;
//             }
//         }
//         return false;
//     }
//     else {
//         const blacklist = items.domain_blacklist;
//         const parts = blacklist.split(/[, ]+/);
        
//         for (let i=0; i < parts.length; i++) {
//             const query = '^' + parts[i].replace(/[.]+/g, '\\.').replace(/([*]+)/g, '[\\w]+') + '$';
//             let result = location.hostname.match(query);
//             if (result != null) {
//                 return false;
//             }
//         }
        
//         return true;
//     }
// }

// A wrapper for console.log which replicate basic Python positional string formatting
// {} in the given text will be replaced by the corresponding parameter
// e.g. log('{} {} {}', 1, 2, 3) will return '1 2 3'
function log(text) {
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            text = text.replace(/({}){1}/, arguments[i]);
        }
    }
    
    console.log(text);
}

function format(text) {
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            text = text.replace(/({}){1}/, arguments[i]);
        }
    }
    return text;
}

function formatOrEmpty(text) {
    if (arguments.length > 1) {
        let edited = false;
        for (var i = 1; i < arguments.length; i++) {
            if (!arguments[i] || arguments[i] == '') {
                continue;
            }
            edited = true;
            text = text.replace(/({}){1}/, arguments[i]);
        }
        if (edited) {
            return text;
        }
    }
    return '';
}

function getValueOr(dictionary, key, defaultValue=null) {
    try {
        let val = dictionary[key];
        if (val == null || val == '' || val == 'undefined') {
            return defaultValue;
        }
        return val;
    }
    catch(e) {
    }
    
    return defaultValue;
}

// content, classes, styles can be a string or array
// id must be a string
// attrs must be a string and is inserted without any validation
function div(content=null, classes=null, styles=null, id=null, attrs=null) {
    return generateTag('div', content, classes, styles, id, attrs);
}

function span(content=null, classes=null, styles=null, id=null, attrs=null) {
    return generateTag('span', content, classes, styles, id, attrs);
}

function generateTag(tagtype='div', content=null, classes=null, styles=null, id=null, attrs=null) {
    let d = '<' + tagtype;
    if (id) {
        d += ' id="' + id + '"';
    }
    if (classes) {
        if (!Array.isArray(classes)) {
            classes = [classes];
        }
        d += ' class="';
        for (let i = 0; i < classes.length; i++) {
            d += i == 0 ? classes[i] : ' ' + classes[i];
        }
        d += '"'
    }
    if (styles) {
        if (!Array.isArray(styles)) {
            styles = [styles];
        }
        d += ' style="';
        for (let i = 0; i < styles.length; i++) {
            d += styles[i] + ';';
        }
        d += '"'
    }
    if (attrs) {
        d += ' ' + attrs;
    }

    d += '>'
    if (content) {
        if (!Array.isArray(content)) {
            content = [content];
        }
        for (let i = 0; i < content.length; i++) {
            d += content[i];
        }
    }
    d += '</' + tagtype + '>'
    return d;
}

function safeAppend(text, values, separator='') {
    if (!Array.isArray(values)) {
        values = [values];
    }
    for (let i = 0; i < values.length; i++) {
        let s = values[i];
        if (s != null && typeof s != 'undefined') {
            text += separator + s;
        }
    }

    return text;
}

function safePrepend(text, value, separator='') {
    if (value == null || typeof value === 'undefined') {
        return text;
    }
    return value + separator + text;
}