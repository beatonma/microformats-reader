import { ChromeBrowserProxy } from "ts/compat/browser/chrome";
import { BrowserProxy } from "ts/compat/browser/types";

declare const browser: any;
declare const chrome: any;

const getCompatBrowser = (): BrowserProxy => {
    if (chrome !== undefined) {
        return new ChromeBrowserProxy();
    }
    if (browser !== undefined) {
        return browser;
    }
    throw "Unsupported browser!";
};

export const compatBrowser = getCompatBrowser();
