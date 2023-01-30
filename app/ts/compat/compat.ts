interface BrowserTab {
    id?: number;
    url?: string;
}

interface BrowserTabs {
    query: (queryInfo: any) => Promise<BrowserTab[]>;
    sendMessage: (tabId: number, message: any) => Promise<any>;
}

interface BrowserRuntimeOnMessage {
    // addListener: (message: any, sender: any, sendMessage: () => void) => void;
    addListener: (listener: any) => void;
}

interface BrowserRuntime {
    onMessage: BrowserRuntimeOnMessage;
}
interface BrowserProxy {
    tabs: BrowserTabs;
    runtime: BrowserRuntime;
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
    };

    runtime = {
        onMessage: {
            addListener: (listener: any) => {
                console.log(`addListener(${listener}`);
                chrome.runtime.onMessage.addListener(listener);
            },
        },
    };
}

// class FirefoxBrowserProxy implements BrowserProxy {}

const getCompatBrowser = (): BrowserProxy => {
    if (chrome !== undefined) {
        return new ChromeBrowserProxy();
    }
    // if (browser !== undefined) {
    //     return new FirefoxBrowserProxy();
    // }
    throw "Unsupported browser!";
};

export const compatBrowser = getCompatBrowser();
