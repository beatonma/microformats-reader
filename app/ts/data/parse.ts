import {
    MicroformatProperties,
    MicroformatProperty,
    MicroformatRoot,
    ParsedDocument,
} from "microformats-parser/dist/types";
import { notNullish } from "ts/data/arrays";
import { Microformat } from "ts/data/microformats";

export namespace Parse {
    export const getRootsOfType = (
        microformats: ParsedDocument,
        type: Microformat.Root
    ): MicroformatRoot[] =>
        microformats.items.filter(item => item.type?.includes(type));

    export const get = <T extends MicroformatProperty>(
        container: MicroformatProperties,
        key: string
    ): T[] | null => {
        const value = container?.[key];
        if (value == null) return null;
        if (value?.length === 0) return null;
        return takeIfNotEmpty(value as T[]);
    };

    export const first = <T extends MicroformatProperty>(
        container: MicroformatProperties,
        key: string
    ): T | null => (get(container, key)?.find(notNullish) as T) ?? null;

    /**
     * Try to read 'key' or 'x-key' values for non-standardised properties.
     */
    export const getExperimental = <T extends MicroformatProperty>(
        hcard: MicroformatProperties,
        key: string
    ): T[] | null => get(hcard, key) ?? get(hcard, `x-${key}`);

    export const takeIfNotEmpty = <T>(arr: T[] | null): T[] | null => {
        if (arr?.length === 0) return null;
        return arr;
    };
}
