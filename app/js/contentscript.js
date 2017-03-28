const microformats = Microformats.get();
const webmentionEndpoint = getWebmentionEndpoint();

let badgeText = '';
if (webmentionEndpoint) {
    badgeText += '<';
}
if (microformats && microformats.items.length > 0) {
    badgeText += '>';
}
if (badgeText != '') {
    chrome.runtime.sendMessage({"action": "setBadgeText", "text": badgeText}, null);
}


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action == 'getMicroformats') {
            let params = {
                'microformats': [],
                'webmentionEndpoint': webmentionEndpoint
            }

            if (microformats && microformats.items.length > 0) {
                params['microformats'] = microformats;
            }
            sendResponse(params);
        }
    });

function getWebmentionEndpoint() {
    const matches = document.documentElement.innerHTML.match(/<(?=.*rel="webmention").*href="(.*?)".*>/);
    return matches ? matches[1] : null;
}