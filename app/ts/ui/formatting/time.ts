import { _, compatBrowser } from "ts/compat";
import { isString } from "ts/data/types";

const TIME_FORMAT: Intl.DateTimeFormatOptions = {
    hourCycle: "h23",
    hour: "2-digit",
    minute: "2-digit",
    day: undefined,
    month: undefined,
    year: undefined,
};

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
};

const DATETIME_FORMAT: Intl.DateTimeFormatOptions = {
    ...TIME_FORMAT,
    ...DATE_FORMAT,
};

const MILLIS_IN_HOUR = 1000 * 60 * 60;
const MILLIS_IN_DAY = MILLIS_IN_HOUR * 24;

const isSameDay = (then: Date, now: Date): boolean =>
    then.getFullYear() === now.getFullYear() &&
    then.getMonth() === now.getMonth() &&
    then.getDate() === now.getDate();

const isYesterday = (then: Date, now: Date): boolean =>
    isSameDay(then, new Date(now.getTime() - MILLIS_IN_DAY));

export const formatShortDateTime = (
    dateStr: string | null | undefined,
    __now?: Date
): string | null => {
    if (dateStr == null) return null;

    const now = __now ?? new Date();
    const date = new Date(dateStr);

    if (isSameDay(date, now)) {
        return _("datetime_time_today", formatTime(date));
    }

    if (isYesterday(date, now)) {
        return _("datetime_time_yesterday", formatTime(date));
    }

    return formatDateTime(date);
};

export const formatDate = (
    datetime: Date | string | null | undefined
): string | null => {
    if (datetime == null) return null;
    const date = isString(datetime) ? new Date(datetime) : datetime;

    return date.toLocaleDateString(
        compatBrowser.i18n.getUILanguage(),
        DATE_FORMAT
    );
};

export const formatTime = (
    datetime: Date | string | null | undefined
): string | null => {
    if (datetime == null) return null;
    const date = isString(datetime) ? new Date(datetime) : datetime;

    return date.toLocaleTimeString(
        compatBrowser.i18n.getUILanguage(),
        TIME_FORMAT
    );
};

export const formatDateTime = (
    datetime: Date | string | null | undefined
): string | null => {
    if (datetime == null) return null;
    const date = isString(datetime) ? new Date(datetime) : datetime;

    const timeStr = formatTime(datetime);
    const dateStr = formatDate(datetime);

    return [timeStr, dateStr].join(" ");
};
