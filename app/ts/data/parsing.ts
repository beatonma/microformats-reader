import { MicroformatProperties } from "microformats-parser/dist/types";

export namespace Parse {
    export const getObject = (container: any, key: string): unknown | null => {
        if (!container) return null;

        if (container.hasOwnProperty(key)) {
            return container[key];
        }
        if (container.hasOwnProperty("properties")) {
            return container["properties"][key];
        }

        return null;
    };

    export const getArray = <T>(container: any, key: string): T[] | null => {
        const obj = getObject(container, key);
        if (obj == null) return null;
        if (!Array.isArray(obj))
            throw `parseFirst expected to find an array, found ${obj}`;
        return obj;
    };

    export const parseFirst = (container: any, key: string): unknown | null =>
        getArray(container, key)?.find(Boolean);

    export const valueOf = (container: any, key: string): string | null => {
        const resolvedObj = getObject(container, key);
        return coerceToString(resolvedObj);
    };

    export const coerceToString = (obj: unknown): string | null => {
        if (obj == null) return null;

        let value: string | null;
        if (typeof obj === "string") value = obj;
        else if (Array.isArray(obj)) value = coerceToString(obj[0]);
        else value = obj.toString();

        // Strip extraneous whitespace
        return value?.replace(/\s+/gm, " ") ?? null;
    };

    /**
     * Try to read 'key' or 'x-key' values for non-standardised properties.
     */
    export const parseExperimental = (
        hcard: MicroformatProperties,
        key: string
    ) => valueOf(hcard, key) ?? valueOf(hcard, `x-${key}`);

    export const parseDate = (container: any, key: string): Date | null => {
        const dateString = valueOf(container, key);
        if (!dateString) return null;

        const date = new Date(dateString);
        if (date.toString() === "Invalid Date") return null;
        return date;
    };
}
