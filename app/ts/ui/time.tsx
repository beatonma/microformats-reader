import React, { HTMLProps } from "react";
import {
    formatDate,
    formatDateTime,
    formatShortDateTime,
} from "ts/ui/formatting/time";
import { titles } from "ts/ui/util";
import { DateOrString } from "ts/data/types/common";

export interface DateTimeProps {
    datetime: DateOrString | null;
    showTime?: boolean;
}
export const DateTime = (props: DateTimeProps & HTMLProps<HTMLTimeElement>) => {
    const { datetime, title } = props;
    const showTime = props.showTime ?? false;

    if (!datetime) return null;

    const displayValue = (showTime ? formatShortDateTime : formatDate)(
        datetime,
    );
    const metaValue = (showTime ? formatDateTime : formatDate)(datetime);
    const resolvedTitle = titles(title, metaValue);

    return (
        <time title={resolvedTitle} dateTime={metaValue ?? undefined}>
            {displayValue}
        </time>
    );
};
