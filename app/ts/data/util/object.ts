/**
 * Returns null if all properties of the given object are null or empty.
 * Otherwise, returns the given object.
 *
 * If requiredKeys is provided, those key must be present with non-empty values.
 * - requireAnyKey requires at least one key to be present and non-empty.
 * If ignoredKeys is provided, values under those keys will be ignored even if they are not empty.
 */
export const nullable = <T extends Record<string, unknown | null>>(
    obj: T,
    options?: {
        ignoredKeys?: string[];
        requiredKeys?: string[];
        requireAnyKey?: string[];
    }
): T | null => {
    const { ignoredKeys, requiredKeys, requireAnyKey } = options ?? {};

    if (!hasRequiredKeys(obj, requiredKeys, requireAnyKey)) {
        return null;
    }

    const nonEmptyKey = Object.keys(obj).find(key => {
        if (ignoredKeys?.includes(key)) {
            return false;
        }
        return !isEmpty(obj[key]);
    });

    if (nonEmptyKey === undefined) {
        return null;
    }

    return obj;
};

export const hasRequiredKeys = <T extends Record<string, unknown | null>>(
    obj: T,
    requiredKeys: string[] | undefined = undefined,
    requireOneKey: string[] | undefined = undefined
) => {
    const nonEmptyValues = Object.entries(obj)
        .filter(([, v]) => isNotEmpty(v))
        .map(([k]) => k);

    if (requiredKeys) {
        for (const key of requiredKeys) {
            if (!nonEmptyValues.includes(key)) return false;
        }
    }

    if (requireOneKey) {
        if (!requireOneKey.some(key => nonEmptyValues.includes(key)))
            return false;
    }

    return true;
};

const isNotEmpty = (obj: unknown) => !isEmpty(obj);

const isEmpty = (obj: unknown): obj is null | undefined => {
    if (obj == null) return true;
    if (Array.isArray(obj)) return obj.length === 0;
    return false;
};
