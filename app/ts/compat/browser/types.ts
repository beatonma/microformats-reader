export interface BrowserProxy {
    tabs: BrowserTabs;
    runtime: BrowserRuntime;
    i18n: Browseri18n;
    action: BrowserAction;
}

//
// Tabs
//
export interface BrowserTab {
    id?: number;
    url?: string;
}
export interface BrowserTabs {
    query: (queryInfo: TabQuery) => Promise<BrowserTab[]>;
    currentTab: () => Promise<BrowserTab | null>;
    sendMessage: (tabId: number | undefined, message: any) => Promise<any>;
    create: (properties: CreateTabProperties) => Promise<any>;
}

export interface TabQuery {
    active?: boolean;
    lastFocusedWindow?: boolean;
}
export interface CreateTabProperties {
    active: boolean;
    url: string;
}

//
// Runtime
//
export interface BrowserRuntimeOnMessage {
    addListener: (listener: any) => void;
}

export interface BrowserRuntime {
    onMessage: BrowserRuntimeOnMessage;
}

//
// i18n
//
export interface Browseri18n {
    getMessage: (key: string, substitutions?: any) => string;
    getUILanguage: () => string;
}

//
// Actions
//
export interface SetBadgeColorDetails {
    tabId: number | undefined;
    background: string;
    text: string;
}
export interface SetBadgeTextDetails {
    tabId: number | undefined;
    text?: string;
}
export interface BrowserAction {
    setBadgeText: (details: SetBadgeTextDetails) => Promise<any>;
    setBadgeColors: (details: SetBadgeColorDetails) => Promise<any>;
}
