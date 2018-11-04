function getSvgViewbox(svgID) {
    switch (svgID) {
        case 'svg_icon_facebook':
        case 'svg_icon_google':
        case 'svg_icon_google_play':
        case 'svg_icon_github':
        case 'svg_icon_instagram':
        case 'svg_icon_linkedin':
        case 'svg_icon_rss':
            return "0 0 48 48";
        case 'svg_icon_twitter':
            return "0 0 56 48";
        case 'svg_icon_youtube':
            return "0 0 64 48";
        default:
            return "0 0 24 24";
    }
}

function getIcon(key, classes='icon', raw=false) {
    let svg = chrome.i18n.getMessage(key);
    if (svg == 'undefined') {
        console.log('Could not get icon for key=' + key);
        return '';
    }
    if (raw) {
        return svg;
    }
    return format('<svg class="{}" viewBox="{}">{}</svg>', classes, getSvgViewbox(key), svg);
}

function getIconForLink(link) {
    let icon = new SvgBuilder('h-item-icon');
    let id = null;
    let noFill = false;

    if (link.match(/^http[s]?:\/\/.*/)) {
        link = link.replace(/^http[s]?:\/\/(www\.)?/, '');
        noFill = true;
        if (link.match(/^twitter\.com\/.*/)) {
            id = 'svg_icon_twitter';
        }
        else if (link.match(/^(plus\.google\.com\/|google\.com\/\+).*/)) {
            id = 'svg_icon_google';
        }
        else if (link.match(/^play\.google\.com\/.*/)) {
            id = 'svg_icon_google_play';
        }
        else if (link.match(/^(gist\.)?github\.com\/.*/)) {
            id = 'svg_icon_github';
        }
        else if (link.match(/^facebook\.com\/.*/)) {
            id = 'svg_icon_facebook';
        }
        else if (link.match(/^instagram\.com\/.*/)) {
            id = 'svg_icon_instagram';
        }
        else if (link.match(/^linkedin\.com\/.*/)) {
            id = 'svg_icon_linkedin';
        }
        else if (link.match(/^youtube\.com\/.*/)) {
            id = 'svg_icon_youtube';
        }
        else if (link.match(/^.*\.\w+\/.*(rss|feed).*/)) {
            id = 'svg_icon_rss';
        }
        else {
            id = 'svg_icon_link';
            noFill = false;
        }
    }
    else if (link.match(/^mailto:/)) {
        id = 'svg_icon_email';
    }
    else if (link.match(/^sms:/)) {
        id = 'svg_icon_sms';
    }

    if (noFill) {
        icon.addClass('nofill');
    }

    icon.setIcon(id);

    return icon;
}

