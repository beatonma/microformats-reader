chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch (request.action) {
            case 'setBadgeText':
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.browserAction.setBadgeText({'text': request.text, 'tabId': tabs[0].id});
                });
                break;
            case 'setIcon':
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    if (request.has_content) {
                        chrome.browserAction.setIcon({path: 'images/icons/ext_has_content.png', 'tabId': tabs[0].id});
                    }
                    else {
                        chrome.browserAction.setIcon({path: 'images/icons/ext_no_content.png', 'tabId': tabs[0].id});
                    }
                });
                break;
        }
    });

chrome.browserAction.setBadgeText({'text': ''});