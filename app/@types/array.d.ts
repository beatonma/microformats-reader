declare interface Array<T> {
    /**
     * Filter any nullish values from the array and return the result,
     * or null if there are no values left in the array.
     */
    nullIfEmpty: <R extends NonNullable<T>>() => R[] | null;
}
