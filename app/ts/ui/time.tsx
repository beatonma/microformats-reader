import React, { ComponentProps } from "react";
import {
    formatDateTime,
    formatShortDateTime,
    isDate,
} from "ts/ui/formatting/time";
import { titles } from "ts/ui/util";
import { DateOrString } from "ts/data/types/common";

export interface DateTimeProps {
    datetime: DateOrString | null;
    formatter?: (dt: DateOrString | null | undefined) => string | null;
}
export const DateTime = (props: DateTimeProps & ComponentProps<"time">) => {
    const { datetime, title, formatter = formatShortDateTime } = props;

    if (!datetime) return null;

    const displayValue = formatter(datetime);
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
