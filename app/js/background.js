chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch (requestion.action) {
            case 'setBadgeText':
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.browserAction.setBadgeText({'text': request.text, "tabId": tabs[0].id});
                });
                break;
            case 'setIcon':
                break;
        }
        // if (request.action == 'setBadgeText') {
        //     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        //         chrome.browserAction.setBadgeText({'text': request.text, "tabId": tabs[0].id});
        //     });
        // }
    });

chrome.browserAction.setBadgeText({'text': ''});