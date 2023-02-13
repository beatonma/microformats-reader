export const notNullish = <T>(value: T | null | undefined): value is T =>
    value != null;

export const anyOf = (values: any[]): values is any[] =>
    values.find(notNullish) != null;

export const noneOf = (values: any[]): values is (null | undefined)[] =>
    values.find(notNullish) == null;
