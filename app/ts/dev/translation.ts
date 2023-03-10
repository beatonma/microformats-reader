import { compatBrowser } from "ts/compat/browser";
import { AppConfig } from "ts/options";

const MessagesJson =
    AppConfig.isDebug || AppConfig.isTest
        ? require("static/_locales/en_GB/messages.json")
        : {};

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

if (AppConfig.isTest || compatBrowser.i18n == null) {
    // Patch translation stuff for in-tab UI dev.
    console.debug(`[DEBUG] Patching browser.i18n (${compatBrowser})`);
    compatBrowser.i18n = {
        getMessage: getStaticMessage,
        getUILanguage: () => "en-GB",
    };
}
