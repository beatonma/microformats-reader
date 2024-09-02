import { compatBrowser } from "ts/compat/browser";

export { compatBrowser } from "./browser";

export const _ = compatBrowser.i18n.getMessage;
export const _pluralize = (
    value: number,
    singleMessageId: string,
    manyMessageId: string = `${singleMessageId}s`,
): string => {
    if (value === 1) {
        return _(singleMessageId, value);
    }
    return _(manyMessageId, value);
};
