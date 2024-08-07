import {
    Html,
    Image,
    MicroformatProperties,
    MicroformatProperty,
    MicroformatRoot,
} from "@microformats-parser";
import { Microformat } from "ts/data/microformats";
import { isString } from "ts/data/types";
import { notNullish, takeIfNotEmpty } from "ts/data/util/arrays";
import { DateOrString } from "ts/data/types/common";

export namespace Parse {
    export const getRootsOfType = (
        items: MicroformatRoot[],
        type: Microformat.H,
    ): MicroformatRoot[] => items.filter(item => item.type?.includes(type));

    export const get = <T extends MicroformatProperty>(
        container: MicroformatProperties,
        key: string,
    ): T[] | null => {
        const value = container?.[key.replace(/^(dt|e|h|p|u)-/, "")];
        return takeIfNotEmpty(value) as T[];
    };

    export const first = <T extends MicroformatProperty>(
        container: MicroformatProperties,
        key: string,
    ): T | null => (get(container, key)?.find(notNullish) as T) ?? null;

    export const firstImage = (
        container: MicroformatProperties,
        key: string,
    ): Image | null => {
        const result = first(container, key);
        if (isString(result)) {
            return {
                value: result,
                alt: "",
            };
        }
        return result as Image;
    };

    export const getDate = (
        container: MicroformatProperties,
        key: string,
    ): DateOrString[] | null => {
        const dates = get<string>(container, key);

        return (
            dates
                ?.map(it => {
                    const d = new Date(it);
                    return isNaN(d.valueOf()) ? it : d;
                })
                .filter(Boolean) ?? null
        );
    };

    export const getEmbeddedValue = (
        container: MicroformatProperties,
        key: string,
    ): string[] | null => {
        return get(container, key)?.map((it: Html) => it["value"]) ?? null;
    };

    /**
     * Try to read 'key' or 'x-key' values for non-standardised properties.
     */
    export const getExperimental = <T extends MicroformatProperty>(
        hcard: MicroformatProperties,
        key: string,
    ): T[] | null => get(hcard, key) ?? get(hcard, `x-${key}`);
}
