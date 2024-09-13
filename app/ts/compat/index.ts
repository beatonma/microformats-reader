import { compatBrowser } from "ts/compat/browser";

export { compatBrowser } from "./browser";

export const _ = compatBrowser.i18n.getMessage;
export const _pluralize = (
    value: number | any[] | null,
    singleMessageId: string,
    manyMessageId: string = `${singleMessageId}s`,
): string => {
    let _value = value;
    if (value === null) {
        _value = 0;
    } else if (Array.isArray(value)) {
        _value = value.length;
    }

    if (_value === 1) {
        return _(singleMessageId, _value);
    }
    return _(manyMessageId, _value);
};
