import {
    BrowserAction,
    BrowserI18n,
    BrowserProxy,
    BrowserRuntime,
    BrowserTabs,
} from "ts/compat/browser/types";

export class MockBrowserProxy implements BrowserProxy {
    constructor() {
        console.log("MockBrowserProxy should only be used in tests.");
    }

    tabs: BrowserTabs = {
        query: mock([]),

        currentTab: mock({}),

        sendMessage: mock({}),

        create: mock({}),
    };

    runtime: BrowserRuntime = {
        onMessage: {
            addListener: mock({}),
        },
    };

    i18n: BrowserI18n = {
        getMessage: getStaticMessage,
        getUILanguage: () => "en-GB",
    };

    // action = mock.action;
    action: BrowserAction = {
        setBadgeText: mock({}),
        setBadgeColors: mock({}),
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