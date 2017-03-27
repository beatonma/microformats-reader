console.log('microformats is running')

let microformats = Microformats.get();
let webmention_endpoint = getWebmentionEndpoint();

let badgeText = '';
if (webmention_endpoint) {
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
                'webmention_endpoint': webmention_endpoint
            }

            if (microformats && microformats.items.length > 0) {
                params['microformats'] = microformats;
            }
            sendResponse(params);
        }
    });

function getWebmentionEndpoint() {
    let matches = document.documentElement.innerHTML.match(/<(?=.*rel="webmention").*href="(.*?)".*>/);
    return matches ? matches[1] : null;
}