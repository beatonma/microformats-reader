import { AppConfig } from "ts/options";

declare const chrome: any;
declare const browser: any;

const MessagesJson = AppConfig.isDebug
    ? require("../../static/_locales/en_GB/messages.json")
    : {};

interface BrowserTab {
    id?: number;
    url?: string;
}

interface CreateTabProperties {
    active: boolean;
    url: string;
}
interface BrowserTabs {
    query: (queryInfo: any) => Promise<BrowserTab[]>;
    sendMessage: (tabId: number | undefined, message: any) => Promise<any>;
    create: (properties: CreateTabProperties) => Promise<any>;
}

interface BrowserRuntimeOnMessage {
    addListener: (listener: any) => void;
}

interface BrowserRuntime {
    onMessage: BrowserRuntimeOnMessage;
}

interface Browseri18n {
    getMessage: (key: string, substitutions?: any) => string;
    getUILanguage: () => string;
}

interface BrowserProxy {
    tabs: BrowserTabs;
    runtime: BrowserRuntime;
    i18n: Browseri18n;
}

class ChromeBrowserProxy implements BrowserProxy {
    tabs = {
        query: (queryInfo: any) =>
            new Promise<BrowserTab[]>((resolve, reject) => {
                chrome.tabs.query(queryInfo, (tabs: BrowserTab[]) => {
                    resolve(tabs);
                });
            }),

        sendMessage: (tabId: number, message: any) =>
            new Promise<any>((resolve, reject) => {
                chrome.tabs.sendMessage(tabId, message, {}, (response: any) => {
                    resolve(response);
                });
            }),

        create: (properties: any) =>
            new Promise<BrowserTab>((resolve, reject) => {
                chrome.tabs.create(properties, (tab: BrowserTab) => {
                    resolve(tab);
                });
            }),
    };

    runtime = {
        onMessage: {
            addListener: (listener: any) => {
                chrome.runtime.onMessage.addListener(listener);
            },
        },
    };

    i18n = chrome.i18n;

    toString = () => "Chrome";
}

const getCompatBrowser = (): BrowserProxy => {
    if (chrome !== undefined) {
        return new ChromeBrowserProxy();
    }
    if (browser !== undefined) {
        return browser;
    }
    throw "Unsupported browser!";
};

function getStaticMessage(name: string, substitutions?: any): string {
    const translation = MessagesJson[name];
    if (!translation) return `__nostr:__${name}`;

    return translation.message.replace(/\$(\w+)\$/, "_");
}

export const compatBrowser = getCompatBrowser();
if (compatBrowser.i18n == null) {
    // Patch translation stuff for in-tab UI dev.
    console.debug(`[DEBUG] Patching browser.i18n (${compatBrowser})`);
    compatBrowser.i18n = {
        getMessage: getStaticMessage,
        getUILanguage: () => "en-GB",
    };
}

export const _ = compatBrowser.i18n.getMessage;
