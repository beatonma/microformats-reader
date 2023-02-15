import React from "react";
import { _ } from "ts/compat";
import {
    PropertiesTable,
    PropertyRow,
} from "ts/components/microformats/properties";
import { PropsOf } from "ts/components/props";
import { Microformat } from "ts/data/microformats";
import { HCardDates } from "ts/data/types/h-card";
import { formatLongDate } from "ts/formatting";

export const DatesPropertiesTable = (props: PropsOf<HCardDates>) => {
    const dates = props.data;
    if (!dates) return null;
    const { birthday, anniversary } = dates;

    return (
        <PropertiesTable>
            <PropertyRow
                microformat={Microformat.DateProp.Dt_Bday}
                displayName={_("hcard_dates_birthday")}
                displayValue={birthday?.map(date => (
                    <Birthday date={date} />
                ))}
            />

            <PropertyRow
                microformat={Microformat.DateProp.Dt_Anniversary}
                displayName={_("hcard_dates_anniversary")}
                displayValue={anniversary?.map(date => (
                    <Time date={date} />
                ))}
            />
        </PropertiesTable>
    );
};

interface DateTimeProps {
    date: string | null;
}

const Time = (props: DateTimeProps) => {
    const { date } = props;
    if (!date) return null;
    return <time dateTime={date}>{formatLongDate(date)}</time>;
};

const Birthday = (props: DateTimeProps) => {
    const birthday = props.date;
    if (!birthday) return null;

    return (
        <>
            <Time date={birthday} /> <Age date={birthday} />
        </>
    );
};

const Age = (props: DateTimeProps) => {
    const { date } = props;
    if (!date) return null;

    const age = yearsSince(date);
    if (!age) return null;

    const ageMessage = _("hcard_age", age.toString());
    return <span>{`(${ageMessage})`}</span>;
};

// Calculate the age of someone given their birthday in yyyy-mm-dd format
const yearsSince = (date: string): number | null => {
    try {
        const then = new Date(date);
        const now = new Date();

        const diffMillis = now.getTime() - then.getTime();
        const years = diffMillis / (1000 * 60 * 60 * 24 * 365);
        return Math.floor(years);
    } catch (e) {
        console.error('could not parse date "' + date + '": ' + e);
        return null;
    }
};
