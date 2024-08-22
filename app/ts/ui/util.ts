import { joinNotEmpty } from "ts/data/util/arrays";

export const classes = (
    ...classNames: (string | null | undefined)[]
): string | undefined => joinNotEmpty(" ", classNames);

export const titles = (
    ...titles: (string | null | undefined)[]
): string | undefined => joinNotEmpty("\n", titles);
