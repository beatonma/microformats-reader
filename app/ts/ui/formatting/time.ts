import { _, compatBrowser } from "ts/compat";
import { isString } from "ts/data/types";
import { DateOrString } from "ts/data/types/common";

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

const MILLIS_IN_HOUR = 1000 * 60 * 60;
const MILLIS_IN_DAY = MILLIS_IN_HOUR * 24;

const isSameDay = (then: Date, now: Date): boolean =>
    then.getFullYear() === now.getFullYear() &&
    then.getMonth() === now.getMonth() &&
    then.getDate() === now.getDate();

const isYesterday = (then: Date, now: Date): boolean =>
    isSameDay(then, new Date(now.getTime() - MILLIS_IN_DAY));

export const yearsSince = (
    datetime: DateOrString,
    __now?: Date,
): number | null => {
    const date = isString(datetime) ? new Date(datetime) : datetime;
    const now = __now ?? new Date();

    const dateHasPassed =
        now.getMonth() >= date.getMonth() && now.getDate() >= date.getDate();
    const yearDifference = now.getFullYear() - date.getFullYear();
    return Math.max(
        0,
        Math.floor(dateHasPassed ? yearDifference : yearDifference - 1),
    );
};

export const isDate = (obj: any): obj is Date => obj instanceof Date;

/**
 * Abbreviated date/time for UI display.
 */
export const formatShortDateTime = (
    datetime: DateOrString | null | undefined,
    __now?: Date,
): string | null => {
    if (datetime == null) return null;

    const now = __now ?? new Date();
    const date = isString(datetime) ? new Date(datetime) : datetime;
    if (isNaN(date.valueOf())) return datetime.toString();

    if (isSameDay(date, now)) {
        return _("datetime_time_today", formatTime(date));
    }

    if (isYesterday(date, now)) {
        return _("datetime_time_yesterday", formatTime(date));
    }

    return formatDate(date);
};

export const formatDate = (
    datetime: DateOrString | null | undefined,
): string | null => {
    if (datetime == null) return null;
    const date = isString(datetime) ? new Date(datetime) : datetime;
    if (isNaN(date.valueOf())) return datetime.toString();

    return date.toLocaleDateString(
        compatBrowser.i18n.getUILanguage(),
        DATE_FORMAT,
    );
};

export const formatTime = (
    datetime: DateOrString | null | undefined,
): string | null => {
    if (datetime == null) return null;
    const date = isString(datetime) ? new Date(datetime) : datetime;
    if (isNaN(date.valueOf())) return datetime.toString();

    return date.toLocaleTimeString(
        compatBrowser.i18n.getUILanguage(),
        TIME_FORMAT,
    );
};

/**
 * Full datetime formatting for metadata.
 */
export const formatDateTime = (
    datetime: DateOrString | null | undefined,
): string | null => {
    if (datetime == null) return null;

    const timeStr = formatTime(datetime);
    const dateStr = formatDate(datetime);

    return [timeStr, dateStr].join(" ");
};
