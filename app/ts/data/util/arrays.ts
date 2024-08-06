/**
 * Return true if value has non-empty contents.
 * If value is an array its children will be tested for non-emptiness.
 */
export const notNullish = <T>(value: T | null | undefined): value is T =>
    value != null;

export const notNullishOrEmpty = <T>(
    value: T | null | undefined,
): value is T => {
    if (Array.isArray(value)) {
        return value.length > 0 || anyOf(value);
    }
    return value != null;
};

export const anyOf = <T>(values: T[]): values is T[] =>
    values.some(notNullishOrEmpty);

export const noneOf = (values: any[]): values is (null | undefined)[] =>
    !values.some(notNullishOrEmpty);

export const isEmptyOrNull = <T>(
    value: T[] | null | undefined,
): value is null | undefined => value == null || value.length === 0;

export const isEmpty = <T>(value: T[]): boolean => value.length === 0;

export const takeIfNotEmpty = <T>(arr: T[] | null): T[] | null => {
    if (isEmptyOrNull(arr)) return null;
    return arr;
};

/**
 * If value is in the list, remove it.
 * If value is not in the list, append it.
 */
export const toggle = <T>(values: T[], value: T): T[] => {
    if (values.includes(value)) return values.filter(it => it !== value);
    return [...values, value];
};
