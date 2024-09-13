export const registerPrimitiveExtensions = () => {
    const addExtension = <T>(
        prototype: object,
        name: string,
        func: (...args: any) => T,
    ) => {
        Object.defineProperty(prototype, name, { value: func });
    };

    addExtension(String.prototype, "let", function <
        // Type <T> unused but required for compatibility with Object.let signature.
        T,
        R,
    >(block: (self: string) => R): R {
        return block(this);
    });

    addExtension(Number.prototype, "let", function <
        // Type <T> unused but required for compatibility with Object.let signature.
        T,
        R,
    >(block: (self: number) => R): R {
        return block(this);
    });
};
