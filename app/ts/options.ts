import { createContext } from "react";
import * as process from "process";

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
}

const defaultOptions: AppOptions = {
    dropdownExpandByDefault: true,
    groupByType: true,
};

export const OptionsContext = createContext<AppOptions>(defaultOptions);
