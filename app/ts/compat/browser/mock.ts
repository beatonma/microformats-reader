import {
    BrowserAction,
    BrowserI18n,
    BrowserProxy,
    BrowserRuntime,
    BrowserStorage,
    BrowserTabs,
} from "ts/compat/browser/types";

export class MockBrowserProxy implements BrowserProxy {
    mockStorage: any;

    constructor() {
        console.debug("MockBrowserProxy should only be used in tests.");
        this.mockStorage = {};
    }

    tabs: BrowserTabs = {
        query: mock([]),

        currentTab: mock({}),

        sendMessage: mock({}),

        create: mock(undefined),
    };

    runtime: BrowserRuntime = {
        onMessage: {
            addListener: mock(undefined),
        },
        sendMessage: mock(undefined),
    };

    i18n: BrowserI18n = {
        getMessage: getStaticMessage,
        getUILanguage: () => "en-GB",
    };

    action: BrowserAction = {
        setBadgeText: mock(undefined),
        setBadgeColors: mock(undefined),
    };

    storage: BrowserStorage = {
        sync: {
            get: async (key: string | string[]) => {
                if (typeof key === "string") {
                    return this.mockStorage[key];
                }
                return key.map(k => this.mockStorage[k]);
            },
            set: async (obj: any) => {
                Object.entries(obj).forEach(([key, value]) => {
                    this.mockStorage[key] = value;
                });
            },
            remove: async (key: string | string[]) => {
                if (typeof key === "string") {
                    delete this.mockStorage[key];
                }
            },
            clear: async () => {
                this.mockStorage = {};
            },
        },
    };

    toString = () => "Mock";
}

interface TranslationMessage {
    message: string;
    placeholders?: Record<string, { content: string; example?: string }>;
}

const mock = <T>(retValue: T): (() => Promise<T>) => {
    return async () => retValue;
};

/**
 * Mock of browser i18n.getMessage when the browser API is not available.
 * e.g.
 * - During tests with `jest`
 * - While building the popup UI in a browser tab instead of in an actual extension popup.
 */
const getStaticMessage = (name: string, ...substitutions: any): string => {
    const MessagesJson = require("static/_locales/en_GB/messages.json");
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
};
