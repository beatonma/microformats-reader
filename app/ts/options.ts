import { createContext, useEffect, useState } from "react";
import * as process from "process";
import { compatBrowser } from "ts/compat";

export enum PopupSection {
    "h-card" = "h-card",
    "h-feed" = "h-feed",
    "relme" = "relme",
}

export const AppConfig = {
    isDebug: (process.env.DEBUG ?? "").toLowerCase() === "true",
    isTest: (process.env.NODE_ENV ?? "").toLowerCase() === "test",
    version: process.env.VERSION_CODE,
    versionHash: process.env.VERSION_HASH,
    versionDate: process.env.VERSION_DATE,
    versionDescription: process.env.VERSION_DESCRIPTION,
};

export interface AppOptions {
    /**
     * Default state of dropdown widgets: expanded (true) or collapsed (false).
     */
    dropdownExpandByDefault: boolean;

    /**
     * Data are always grouped near similar content, but this
     * option alters how it is rendered.
     *
     * If true, groups of data have a header label describing them.
     *   May be more readable when there are a lot of data to display.
     * If false, groups have minimal separation and no header label.
     *   May be more readable when there are only a few data to display.
     */
    groupByType: boolean;

    popupContents: PopupSection[];
}

const defaultOptions = (): AppOptions => ({
    dropdownExpandByDefault: true,
    groupByType: true,
    popupContents: [
        PopupSection["h-card"],
        PopupSection["h-feed"],
        PopupSection.relme,
    ],
});

export const OptionsContext = createContext<AppOptions>(defaultOptions());

export const loadOptions = async () =>
    compatBrowser.storage.sync.get(defaultOptions());

export const saveOptions = async (options: AppOptions) =>
    compatBrowser.storage.sync.set(options);

export const useOptions = (): [
    AppOptions | undefined,
    (options: AppOptions) => void,
] => {
    const [options, setOptions] = useState();
    const [reloadSwitch, setReloadSwitch] = useState(false);

    useEffect(() => {
        loadOptions().then(setOptions);
    }, [reloadSwitch]);

    return [
        options,
        opts => {
            saveOptions(opts).then(() => setReloadSwitch(it => !it));
        },
    ];
};
