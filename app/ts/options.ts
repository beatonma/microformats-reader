import { createContext, useEffect, useState } from "react";
import * as process from "process";
import { _, compatBrowser } from "ts/compat";

export interface MapsProvider {
    /**
     * Unique const name used in code
     */
    apiName: string;

    /**
     * Translatable name used in UI.
     */
    uiName: string;

    /**
     * A URL with `{query}` placeholder.
     */
    search: string;
}

export namespace AppOptions {
    export type PopupSection =
        | "h-card"
        | "h-feed"
        | "h-event"
        | "h-adr"
        | "rel";

    export const MapProvider = {
        GoogleEarth: {
            apiName: "google-earth",
            uiName: _("options_maps_provider_googleearth"),
            search: "https://earth.google.com/web/search/{query}/",
        },
        GoogleMaps: {
            apiName: "google-maps",
            uiName: _("options_maps_provider_googlemaps"),
            search: "https://www.google.com/maps/search/{query}",
        },
        OpenStreetMap: {
            apiName: "open-street-map",
            uiName: _("options_maps_provider_openstreetmap"),
            search: "https://www.openstreetmap.org/search?query={query}",
        },
    };
}

export const AppConfig = {
    version: process.env.VERSION_CODE,
    versionHash: process.env.VERSION_HASH,
    versionDate: process.env.VERSION_DATE,
    versionDescription: process.env.VERSION_DESCRIPTION,
};

export interface AppOptions {
    /**
     * Default state of Dropdown components: expanded (true) or collapsed (false).
     */
    dropdownExpandByDefault: boolean;

    /**
     * Default state of ExpandableCard components.
     */
    cardExpandByDefault: boolean;

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

    popupContents: Record<AppOptions.PopupSection, boolean>;

    mapsProvider: MapsProvider;
}

export const defaultOptions = (): AppOptions => ({
    cardExpandByDefault: false,
    dropdownExpandByDefault: true,
    groupByType: true,
    popupContents: {
        "h-card": true,
        "h-feed": true,
        "h-event": true,
        "h-adr": true,
        rel: true,
    },
    mapsProvider: AppOptions.MapProvider.OpenStreetMap,
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
