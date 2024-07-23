export const classes = (...classNames: (string | null | undefined)[]): string =>
    classNames.filter(Boolean).join(" ");
