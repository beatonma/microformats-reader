/**
 * Returns null if all properties of the given object are null or empty.
 * Otherwise, returns the given object.
 *
 * If requiredKeys is provided, those key must be present with non-empty values.
 * - requireAnyKey requires at least one key to be present and non-empty.
 * If ignoredKeys is provided, values under those keys will be ignored even if they are not empty.
 */
export const nullable = <T extends Record<string, any | null>>(
    obj: T | null | undefined,
    options?: {
        ignoredKeys?: (keyof T)[];
        requiredKeys?: (keyof T)[];
        requireAnyKey?: (keyof T)[];
    },
): T | null => {
    const {
        ignoredKeys = ["type"],
        requiredKeys,
        requireAnyKey,
    } = options ?? {};

    if (obj == null) return null;

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

const hasRequiredKeys = <T extends Record<string, unknown | null>>(
    obj: T,
    requiredKeys: (keyof T)[] | undefined,
    requireAnyKey: (keyof T)[] | undefined,
) => {
    const nonEmptyValues = Object.entries(obj)
        .filter(([, v]) => isNotEmpty(v))
        .map(([k]) => k as keyof T);

    if (requiredKeys) {
        for (const key of requiredKeys) {
            if (!nonEmptyValues.includes(key)) {
                return false;
            }
        }
    }

    if (requireAnyKey) {
        if (!requireAnyKey.some(key => nonEmptyValues.includes(key))) {
            return false;
        }
    }

    return true;
};

const isEmpty = (obj: unknown): obj is null | undefined => {
    if (obj == null) return true;
    if (Array.isArray(obj)) return obj.length === 0;
    return false;
};
const isNotEmpty = (obj: unknown) => !isEmpty(obj);

/**
 * @returns `value` if condition is true, otherwise `undefined`.
 */
export const onlyIf = <T>(condition: boolean, value: T) =>
    condition ? value : undefined;

/**
 * @returns the result of calling `block(obj)`, or `undefined` if `obj` is falsy.
 */
export const withNotNull = <T, R>(
    obj: T | null | undefined,
    block: (obj: T) => R,
): R | undefined => {
    if (obj) {
        return block(obj);
    }
};

export const registerObjectExtensions = () => {
    const addExtension = <T>(name: string, func: (...args: any) => T) => {
        Object.defineProperty(Object.prototype, name, { value: func });
    };

    addExtension("let", function <T, R>(block: (self: T) => R) {
        return block(this);
    });

    addExtension("toJson", function () {
        return JSON.stringify(this, null, 2);
    });
};

export const _testOnly = {
    hasRequiredKeys: hasRequiredKeys,
};
