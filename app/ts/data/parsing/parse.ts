import {
    Html,
    Image,
    MicroformatProperties,
    MicroformatProperty,
    MicroformatRoot,
    ParsedDocument,
} from "microformats-parser/dist/types";
import { Microformat } from "ts/data/microformats";
import { isString } from "ts/data/types";
import { notNullish } from "ts/data/util/arrays";

export namespace Parse {
    export const getRootsOfType = (
        microformats: ParsedDocument,
        type: Microformat.H
    ): MicroformatRoot[] =>
        microformats.items.filter(item => item.type?.includes(type));

    export const get = <T extends MicroformatProperty>(
        container: MicroformatProperties,
        key: string
    ): T[] | null => {
        const value = container?.[key.replace(/^(dt|e|h|p|u)-/, "")];
        if (value == null) return null;
        if (value?.length === 0) return null;
        return value as T[];
    };

    export const first = <T extends MicroformatProperty>(
        container: MicroformatProperties,
        key: string
    ): T | null => (get(container, key)?.find(notNullish) as T) ?? null;

    export const firstImage = (
        container: MicroformatProperties,
        key: string
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
        key: string
    ): Date[] | null => {
        const dates = get<string>(container, key);

        return dates?.map(it => new Date(it)) ?? null;
    };

    export const getEmbeddedValue = (
        container: MicroformatProperties,
        key: string
    ): string[] | null => {
        return get(container, key)?.map((it: Html) => it["value"]) ?? null;
    };

    /**
     * Try to read 'key' or 'x-key' values for non-standardised properties.
     */
    export const getExperimental = <T extends MicroformatProperty>(
        hcard: MicroformatProperties,
        key: string
    ): T[] | null => get(hcard, key) ?? get(hcard, `x-${key}`);
}
