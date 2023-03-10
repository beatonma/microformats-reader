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
    dropdownExpandByDefault: boolean;
}

export const defaultOptions: AppOptions = {
    dropdownExpandByDefault: false,
};

export const OptionsContext = createContext<AppOptions>(defaultOptions);
