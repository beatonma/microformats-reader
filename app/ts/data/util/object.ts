import { isEmptyOrNull, noneOf } from "ts/data/util/arrays";

/**
 * Returns null iIf all properties of the given object are null or empty.
 * Otherwise, returns the given object.
 *
 * If ignoredKeys is provided, values under those keys will be ignored even if they are not empty.
 */
export const nullable = <T extends Record<string, unknown | null>>(
    obj: T,
    ignoredKeys?: string[]
): T | null => {
    if (isEmptyOrNull(ignoredKeys)) {
        return noneOf(Object.values(obj)) ? null : obj;
    }

    for (const [key, value] of Object.entries(obj)) {
        if (value != null && !ignoredKeys.includes(key)) return obj;
    }

    return null;
};
