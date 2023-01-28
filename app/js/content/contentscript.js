let microformats = Microformats.get();
const webmentionEndpoint = getWebmentionEndpoint();

let badgeText = "";
if (webmentionEndpoint) {
    badgeText += "<";
}
const useful = hasUsefulData(microformats);
if (useful) {
    badgeText += ">";
}
if (badgeText !== "") {
    chrome.runtime.sendMessage({ action: "setIcon", has_content: true }, null);
    chrome.runtime.sendMessage(
        { action: "setBadgeText", text: badgeText },
        null
    );
} else {
    chrome.runtime.sendMessage({ action: "setIcon", has_content: false }, null);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "getMicroformats") {
        let params = {
            microformats: [],
            webmentionEndpoint: webmentionEndpoint,
        };

        if (useful) {
            params["microformats"] = microformats;
        }
        sendResponse(params);
    }
});

function getWebmentionEndpoint() {
    const matches = document.documentElement.innerHTML.match(
        /<(?=.*rel="webmention").*href="(.*?)".*>/
    );
    return matches ? matches[1] : null;
}

/**
 * Check if the parsed data contains anything that we can currently handle
 */
function hasUsefulData(mf) {
    if (!mf) {
        return false;
    }
    let hasUsefulHObjects = false;
    let hasUsefulRels = false;

    const hObjects = getValueOr(mf, "items");
    if (hObjects) {
        for (let i = 0; i < hObjects.length; i++) {
            const item = hObjects[i];
            const type = getValueOr(item, "type");
            if (type) {
                if (
                    type.indexOf("h-card") >= 0 ||
                    type.indexOf("h-entry") >= 0
                ) {
                    hasUsefulHObjects = true;
                    break;
                }
            }
        }
    }

    let rels = mf["rels"];
    if (rels) {
        if (getValueOr(rels, "pgpkey")) {
            console.log("has pgpkey");
            hasUsefulRels = true;
        }
        if (getValueOr(rels, "me")) {
            console.log("has relme");
            hasUsefulRels = true;
        }
        if (getValueOr(rels, "friend")) {
            console.log("has xfn friend");
            hasUsefulRels = true;
        }
    }

    return hasUsefulHObjects || hasUsefulRels;
}

function getValueOr(dictionary, key, defaultValue = null) {
    try {
        let val = dictionary[key];
        if (val == null || val === "" || val === "undefined") {
            return defaultValue;
        }
        return val;
    } catch (e) {}

    return defaultValue;
}
