export const onlyIf = <T>(condition: boolean, value: T) => {
    if (typeof value === "function") {
        return condition ? value() : undefined;
    }
    return condition ? value : undefined;
};
