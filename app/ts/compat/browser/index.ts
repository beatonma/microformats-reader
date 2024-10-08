import { ChromeBrowserProxy } from "ts/compat/browser/chrome";
import { BrowserProxy } from "ts/compat/browser/types";
import { MockBrowserProxy } from "ts/compat/browser/mock";

declare const browser: any | undefined;
declare const chrome: any | undefined;

const getCompatBrowser = (): BrowserProxy => {
    if (typeof chrome !== "undefined" && typeof chrome.i18n !== "undefined") {
        return new ChromeBrowserProxy();
    }
    if (typeof browser !== "undefined" && typeof browser.i18n !== "undefined") {
        return browser;
    }

    return new MockBrowserProxy();
};

export const compatBrowser = getCompatBrowser();
