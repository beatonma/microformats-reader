import {
    BrowserAction,
    BrowserI18n,
    BrowserProxy,
    BrowserRuntime,
    BrowserStorage,
    BrowserTab,
    BrowserTabs,
    SetBadgeColorDetails,
    SetBadgeTextDetails,
    SetIconDetails,
} from "ts/compat/browser/types";

declare const chrome: any;

export class ChromeBrowserProxy implements BrowserProxy {
    tabs: BrowserTabs = {
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

    runtime: BrowserRuntime = {
        onMessage: {
            addListener: (listener: any) => {
                chrome.runtime?.onMessage?.addListener(listener);
            },
        },
        sendMessage: chrome.runtime?.sendMessage,
        openOptionsPage: chrome.runtime?.openOptionsPage,
    };

    i18n: BrowserI18n = chrome.i18n;

    action: BrowserAction = {
        setBadgeText: (details: SetBadgeTextDetails) => {
            if (chrome.action == null)
                return browserProxyError("chrome.action.setBadgeText");

            return chrome.action.setBadgeText(details);
        },
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
                    }),
                );
        },
        setIcon: (details: SetIconDetails) => {
            if (chrome.action == null)
                return browserProxyError("chrome.action.setIcon");
            return chrome.action.setIcon(details);
        },
    };

    storage: BrowserStorage = {
        sync: chrome.storage.sync,
    };

    toString = () => "Chrome";
}

const browserProxyError = (name: string, reject?: () => void): null => {
    console.error(
        `'${name}' failed. This should only occur during in-tab UI building development.`,
    );
    reject?.();
    return null;
};
