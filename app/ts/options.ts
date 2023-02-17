import { createContext } from "react";
import * as process from "process";

export const AppConfig = {
    isDebug: (process.env.DEBUG ?? "").toLowerCase() === "true",
};

export interface AppOptions {
    dropdownExpandByDefault: boolean;
}

export const defaultOptions: AppOptions = {
    dropdownExpandByDefault: false,
};

export const OptionsContext = createContext<AppOptions>(defaultOptions);
