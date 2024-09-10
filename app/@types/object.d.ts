declare interface Object {
    /**
     * Clone of T.let {} from Kotlin.
     *
     * Passes the receiving object to the given block and returns the result.
     */
    let: <T, R>(block: (self: NonNullable<T>) => R) => R;

    toJson: () => string;
}
