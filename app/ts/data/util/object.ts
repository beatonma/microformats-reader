import { noneOf } from "ts/data/util/arrays";

export const nullable = <T extends Record<string, unknown | null>>(
    obj: T
): T | null => {
    if (noneOf(Object.values(obj))) return null;
    return obj;
};
