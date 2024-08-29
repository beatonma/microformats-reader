import React, { HTMLProps } from "react";
import {
    formatDate,
    formatDateTime,
    formatShortDateTime,
    isDate,
} from "ts/ui/formatting/time";
import { titles } from "ts/ui/util";
import { DateOrString } from "ts/data/types/common";

export interface DateTimeProps {
    datetime: DateOrString | null;
    showTime?: boolean;
}
export const DateTime = (props: DateTimeProps & HTMLProps<HTMLTimeElement>) => {
    const { datetime, title, showTime = false } = props;

    if (!datetime) return null;

    const displayValue = (showTime ? formatShortDateTime : formatDate)(
        datetime,
    );
    const metaValue = isDate(datetime)
        ? datetime.toISOString()
        : formatDateTime(datetime);
    const resolvedTitle = titles(title, metaValue);

    return (
        <time title={resolvedTitle} dateTime={metaValue ?? undefined}>
            {displayValue}
        </time>
    );
};
