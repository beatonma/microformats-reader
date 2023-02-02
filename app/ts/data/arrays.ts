export const anyOf = (values: any[]) => values.filter(Boolean).length > 0;
export const noneOf = (values: any[]) => values.filter(Boolean).length === 0;
