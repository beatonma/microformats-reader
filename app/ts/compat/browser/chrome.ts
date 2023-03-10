import {
    BrowserProxy,
    BrowserTab,
    SetBadgeColorDetails,
    SetBadgeTextDetails,
} from "ts/compat/browser/types";

declare const chrome: any;

export class ChromeBrowserProxy implements BrowserProxy {
    tabs = {
        query: (queryInfo: any) => chrome.tabs.query(queryInfo),

        currentTab: () =>
            this.tabs
                .query({ active: true, lastFocusedWindow: true })
                .then((tabs: BrowserTab[]) => {
                    if (tabs.length > 0) return tabs[0];
                    return null;
                }),

        sendMessage: (tabId: number, message: any) =>
            chrome.tabs.sendMessage(tabId, message, {}),

        create: (properties: any) => chrome.tabs.create(properties),
    };

    runtime = {
        onMessage: {
            addListener: (listener: any) => {
                chrome.runtime?.onMessage?.addListener(listener);
            },
        },
    };

    i18n = chrome.i18n;

    // action = chrome.action;
    action = {
        setBadgeText: (details: SetBadgeTextDetails) =>
            chrome.action?.setBadgeText(details),
        setBadgeColors: (details: SetBadgeColorDetails) => {
            if (chrome.action == null)
                return browserProxyError("chrome.action.setBadgeColors");

            return chrome.action
                .setBadgeTextColor({
                    tabId: details.tabId,
                    color: details.text,
                })
                .then(() =>
                    chrome.action.setBadgeBackgroundColor({
                        tabId: details.tabId,
                        color: details.background,
                    })
                );
        },
    };

    toString = () => "Chrome";
}

const browserProxyError = (name: string, reject?: () => void): null => {
    console.error(
        `'${name}' failed. This should only occur during in-tab UI building development.`
    );
    reject?.();
    return null;
};
