export const joinNotNull = (
    joiner: string,
    ...values: (string | null | undefined)[]
): string | undefined => {
    const result = values.filter(Boolean).join(joiner);
    if (result) return result;
};

export const classes = (
    ...classNames: (string | null | undefined)[]
): string | undefined => joinNotNull(" ", ...classNames);

export const titles = (
    ...titles: (string | null | undefined)[]
): string | undefined => joinNotNull("\n", ...titles);
