export const onlyIf = <T>(condition: boolean, value: T) =>
    condition ? value : undefined;
