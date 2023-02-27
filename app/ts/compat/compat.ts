import { AppConfig } from "ts/options";

declare const chrome: any;
declare const browser: any;

const MessagesJson =
    AppConfig.isDebug || AppConfig.isTest
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

interface TranslationMessage {
    message: string;
    placeholders?: Record<string, { content: string; example?: string }>;
}

/**
 * Mock of browser i18n.getMessage when the browser API is not available.
 * e.g.
 * - During tests with `jest`
 * - While building the popup UI in a browser tab instead of in an actual extension popup.
 */
function getStaticMessage(name: string, ...substitutions: any): string {
    const translation: TranslationMessage | null = MessagesJson[name];

    if (!translation) return `__nostr:__${name}`;

    const placeholders = translation.placeholders;
    let message = translation.message;

    if (substitutions && placeholders) {
        message = message.replace(/\$(\w+)\$/g, (substring, argName) => {
            // Replace $ARGS$ with substitutions according to placeholders definitions.
            const content = placeholders[
                argName.toLowerCase()
            ]?.content?.replace(/^\$/, "");

            if (content) {
                const index = parseInt(content) - 1;
                if (!isNaN(index)) {
                    return substitutions[index];
                }
            }
            return "__bad_substitution__";
        });
        return message;
    }

    return message.replace(/\$(\w+)\$/, "_");
}

export const compatBrowser = getCompatBrowser();
if (AppConfig.isTest || compatBrowser.i18n == null) {
    // Patch translation stuff for in-tab UI dev.
    console.debug(`[DEBUG] Patching browser.i18n (${compatBrowser})`);
    compatBrowser.i18n = {
        getMessage: getStaticMessage,
        getUILanguage: () => "en-GB",
    };
}

export const _ = compatBrowser.i18n.getMessage;
