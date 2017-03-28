function getMessage(key) {
    let message =  chrome.i18n.getMessage(key);
    if (message == 'undefined') {
        console.log('Could not get message for key=' + key);
        return key;
    }
    return message;
}

/**
 * Finds link addresses in the given object and wraps them in an HTML <a> tag.
 * @param  {[type]} Text in which to find links
 * @param  {[type]} Text to show instead of the link address
 * @return {[type]} obj, or obj with all links wrapped in <a></a> tags.
 */
function linkify(obj, text=null) {
    try {
        return String(obj).replace(
            /\s*(mailto:([^\s<>]+)|(\w+:\/\/[^\s<>]+)|(\s*(sms:([^\s<>]+))))/g,
            format('<a href="$1">{}</a>', (text || '$2$3$4'))
        );
    }
    catch(e) {
        // obj is not a String
        return obj;
    }
}

/**
 * Make a short name from the given text which is suitable to use as an ID for
 * an HTML element.
 */
function makeHtmlId(text) {
    return String(text).replace(/[^\w]+/g, '-').slice(0, 15);
}

/**
 * @param  {string} A description of a place or address
 * @return {string} A formatted link for a Google Maps search
 */
function getMapsUrl(query) {
    let url = 'https://www.google.com/maps/search/' + String(query).replace(/[\s]+/g, '+');
    console.log(format('getMapsUrl("{}") -> "{}"', query, url));
    return url;
}

// Calculate the age of someone given their birthday in yyyy-mm-dd format
function yearsSince(date) {
    try {
        const then = new Date(date);
        const now = new Date();

        const diffMillis = now.getTime() - then.getTime();
        const years = diffMillis / (1000*60*60*24*365);
        return Math.floor(years);
    }
    catch(e) {
        console.log('could not parse date "' + date + '": ' + e);
    }

    return date;
}

/**
 * Wrapper for console.log that allows Python-style positional formatting.
 * @param  {[type]}
 * @return {[type]}
 */
function log(text) {    
    console.log(format(text));
}

/**
 * Replicates basic positional string formatting from Python
 * 
 * @param  {[string,object]} The first argument is the string to be formatted
 *                           Any following arguments are used to replace '{}'
 *                           in the main string.
 * @return {[type]}
 */
function format(text) {
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            text = text.replace(/({}){1}/, arguments[i]);
        }
    }
    return text;
}

/**
 * If the given format arguments are null or empty then this will return
 * an empty string. Otherwise will return the fully formatted string in the
 * same way as format() above.
 */
function formatOrEmpty(text) {
    if (arguments.length > 1) {
        let edited = false;
        for (let i = 1; i < arguments.length; i++) {
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

/**
 * @param  {object,array}   A dictionary-like object
 * @param  {string,integer} A dictionary key or array position
 * @param  {[type]}         Object to return in case the value cannot be retrieved
 * @return {[type]}         The value from dictionary that corresponds to key,
 *                          or defaultValue if that value is not found.
 */
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