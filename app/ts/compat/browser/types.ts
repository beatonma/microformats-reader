import { MessageRequest } from "ts/message";

type ErrorString = void | string | undefined;

export interface BrowserProxy {
    tabs: BrowserTabs;
    runtime: BrowserRuntime;
    i18n: BrowserI18n;
    action: BrowserAction;
    storage: BrowserStorage;
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
    sendMessage: <T extends MessageRequest>(
        tabId: number | undefined,
        message: T,
    ) => Promise<unknown | ErrorString>;
    create: (properties: CreateTabProperties) => Promise<ErrorString>;
}

interface TabQuery {
    active?: boolean;
    lastFocusedWindow?: boolean;
}
interface CreateTabProperties {
    active: boolean;
    url: string;
}

//
// Runtime
//
interface MessageSender {
    documentId?: string;
    documentLifecycle?: string;
    frameId?: number;
    id?: string;
    origin?: string;
    tab?: BrowserTab;
    tlsChannelId?: string;
    url?: string;
}
type MessageListener = (
    message: MessageRequest,
    sender: MessageSender,
    sendResponse: (response: object) => void,
) => boolean | Promise<unknown>;
export interface BrowserRuntimeOnMessage {
    addListener: (listener: MessageListener) => void;
}

export interface BrowserRuntime {
    onMessage: BrowserRuntimeOnMessage;
    sendMessage: <T extends MessageRequest>(
        message: T,
        options?: object,
    ) => Promise<unknown | ErrorString>;
    openOptionsPage: () => Promise<void>;
}

//
// i18n
//
export interface BrowserI18n {
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
export interface SetIconDetails {
    imageData?: ImageData | object;
    path?: string | object;
    tabId?: number;
    windowId?: number;
}
export interface BrowserAction {
    setBadgeText: (details: SetBadgeTextDetails) => Promise<ErrorString>;
    setBadgeColors: (details: SetBadgeColorDetails) => Promise<ErrorString>;
    setIcon: (details: SetIconDetails) => Promise<ErrorString>;
}

//
// Storage
//
interface StorageArea {
    get: <T>(
        keys: string | string[] | object | null,
    ) => Promise<T | ErrorString>;
    set: <T>(obj: T) => Promise<ErrorString>;
    remove: (keys: string | string[]) => Promise<ErrorString>;
    clear: (err?: unknown) => Promise<ErrorString>;
}
export interface BrowserStorage {
    sync: StorageArea;
}
