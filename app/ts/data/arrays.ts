export const notNullish = <T>(value: T | null | undefined): value is T =>
    value != null;

export const anyOf = <T>(values: T[]): values is T[] =>
    values.find(notNullish) != null;

export const noneOf = (values: any[]): values is (null | undefined)[] =>
    values.find(notNullish) == null;

export const isEmptyOrNull = <T>(
    value: T[] | null | undefined
): value is null | undefined => value == null || value.length === 0;

export const isEmpty = <T>(value: T[]): boolean => value.length === 0;
