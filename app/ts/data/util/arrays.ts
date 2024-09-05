/**
 * Return true if value is not null, undefined, an empty string, or an empty array.
 */
const isUseful = <T>(value: T | null | undefined): value is T => {
    if (Array.isArray(value)) {
        return value.length > 0;
    }
    return value != null && value !== "";
};

/**
 * @returns true if the given array has at least one value that is [useful]{@link isUseful}.
 */
export const anyOf = <T>(values: (T | null | undefined)[]): values is T[] =>
    values.some(isUseful);

/**
 * @returns true if every value in the array is [useful]{@link isUseful}.
 */
export const allOf = <T>(values: (T | null | undefined)[]): values is T[] =>
    values.every(isUseful) && values.length > 0;

/**
 * @returns true if the given array contains no [useful]{@link isUseful} values..
 */
export const noneOf = (values: any[]): values is (null | undefined)[] =>
    !values.some(isUseful);

/**
 * Wrap the given value in an array, if it is not already an array.
 */
export const asArray = <T>(value: T | T[]): T[] =>
    Array.isArray(value) ? value : [value];

/**
 * Remove any nullish or empty values and join the result.
 */
export const joinNotEmpty = (
    joiner: string,
    values: (string | null | undefined)[],
): string | undefined => nullIfEmpty(values)?.join(joiner);

/**
 * @returns a new array of the same length as a, b, where the value at each
 * position is tuple of the values from a, b, at that index.
 *
 * @returns or `null` if the arrays do not share the same length
 */
export const zip = <A, B>(
    a: A[] | null | undefined,
    b: B[] | null | undefined,
): [A, B][] | null => {
    if (a == null || b == null) return null;
    if (a.length !== b.length) return null;

    return a.map((it, index) => [it, b[index]]);
};

/**
 * Like {@link zip}, returns a new array by combing values from the given arrays.
 * Unlike {@link zip}, the given arrays do not need to be equal in length.
 * The returned array will have the same length as the longest given array
 * with null values inserted when a value cannot be retrieved from either of
 * the source arrays.
 *
 * e.g. `zipOrNull([1, 2, 3], [4])` will return `[[1, 4], [2, null], [3, null]]`.
 */
export const zipOrNull = <A, B>(
    a: A[] | null | undefined,
    b: B[] | null | undefined,
): [A | null, B | null][] | null => {
    if (a == null && b == null) return null;

    const len = Math.max(a?.length ?? 0, b?.length ?? 0);
    return [...Array(len).keys()].map(index => [
        a?.[index] ?? null,
        b?.[index] ?? null,
    ]);
};

/**
 * Split the given list into two lists:
 * - first, the values for which `predicate(value)` returns true
 * - last, the values for which `predicate(value)` returns false
 */
export const partition = <T>(
    values: T[],
    predicate: (obj: T) => boolean,
): [T[], T[]] => {
    const positive: T[] = [];
    const negative: T[] = [];

    values.forEach(it => {
        if (predicate(it)) {
            positive.push(it);
        } else {
            negative.push(it);
        }
    });

    return [positive, negative];
};

const nullIfEmpty = <T>(values: (T | null | undefined)[]): T[] | null => {
    const filtered = values.filter(isUseful);
    if (!isUseful(filtered)) return null;
    return filtered;
};

export const registerArrayExtensions = () => {
    const addExtension = <T>(name: string, func: (...args: any) => T) => {
        Object.defineProperty(Array.prototype, name, { value: func });
    };

    addExtension("nullIfEmpty", function () {
        return nullIfEmpty(this);
    });
};
