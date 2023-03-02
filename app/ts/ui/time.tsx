import React, { HTMLProps } from "react";
import { notNullish } from "ts/data/util/arrays";
import {
    formatDate,
    formatDateTime,
    formatShortDateTime,
} from "ts/ui/formatting/time";

export interface DateTimeProps {
    datetime: Date | null;
    showTime?: boolean;
}
export const DateTime = (props: DateTimeProps & HTMLProps<HTMLTimeElement>) => {
    const { datetime, title } = props;
    const showTime = props.showTime ?? false;

    if (!datetime) return null;

    const displayValue = (showTime ? formatShortDateTime : formatDate)(
        datetime
    );
    const metaValue = (showTime ? formatDateTime : formatDate)(datetime);
    const resolvedTitle = [title, metaValue].filter(notNullish).join("\n");

    return (
        <time title={resolvedTitle} dateTime={metaValue ?? undefined}>
            {displayValue}
        </time>
    );
};
