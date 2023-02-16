import { createContext } from "react";

export interface AppOptions {
    dropdownExpandByDefault: boolean;
}

const defaultOptions: AppOptions = {
    dropdownExpandByDefault: false,
};

export const OptionsContext = createContext<AppOptions>(defaultOptions);
