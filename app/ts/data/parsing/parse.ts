import {
    Html,
    Image,
    MicroformatProperties,
    MicroformatProperty,
    MicroformatRoot,
} from "@microformats-parser";
import { Microformat } from "ts/data/microformats";
import { isString } from "ts/data/types";
import { DateOrString } from "ts/data/types/common";

export namespace Parse {
    export const getRootsOfType = (
        items: MicroformatRoot[],
        type: Microformat.H,
    ): MicroformatRoot[] => items.filter(item => item.type?.includes(type));

    export const get = <T extends MicroformatProperty>(
        container: MicroformatProperties,
        key: Microformat,
    ): T[] | null =>
        container?.[key.replace(/^(dt|e|h|p|u)-/, "")]?.nullIfEmpty() ?? null;

    /**
     * All microformat property values are parsed generically as arrays, but
     * some properties only make sense as a single value.
     *
     * e.g. an `h-geo` with 2 values for `p-latitude` is not useful.
     *
     * @returns unwrapped single value from the property value array,
     *          or null if the value array has length !== 1.
     */
    export const single = <T extends MicroformatProperty>(
        container: MicroformatProperties,
        key: Microformat,
    ): T | null => {
        const value = get(container, key);
        if (!value) return null;
        if (value.length === 1)
            return (value[0] as T | null | undefined) ?? null;
        return null;
    };

    /**
     * @returns the property values interpreted as Images.
     */
    export const getImages = (
        container: MicroformatProperties,
        key: Microformat.U,
    ): Image[] | null =>
        get(container, key)
            ?.map(it => (isString(it) ? { value: it, alt: "" } : (it as Image)))
            ?.nullIfEmpty() ?? null;

    /**
     * @returns the property values, each coerced to a Date object if possible,
     * or kept as a string if not.
     */
    export const getDates = (
        container: MicroformatProperties,
        key: Microformat.Dt,
    ): DateOrString[] | null => {
        const dates = get<string>(container, key);

        return (
            dates
                ?.map(it => {
                    const d = new Date(it);
                    return isNaN(d.valueOf()) ? it : d;
                })
                ?.nullIfEmpty() ?? null
        );
    };

    /**
     * @returns the plain text content of an `e-` container.
     */
    export const getEmbeddedValue = (
        container: MicroformatProperties,
        key: Microformat.E,
    ): string[] | null =>
        get(container, key)
            ?.map((it: Html) => it["value"])
            ?.nullIfEmpty() ?? null;

    /**
     * Try to read 'key' or 'x-key' values for non-standardised properties.
     */
    export const getExperimental = <T extends MicroformatProperty>(
        hcard: MicroformatProperties,
        key: Microformat.X.All,
    ): T[] | null => {
        const keyRoot = key.replace(/^((dt|e|h|p|u)-)?(x-)?/, "");
        return (
            get(hcard, keyRoot as Microformat.X.All) ??
            get(hcard, `x-${keyRoot}` as Microformat.X.All)
        );
    };
}
