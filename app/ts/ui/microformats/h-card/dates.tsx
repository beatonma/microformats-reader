import React from "react";
import { _ } from "ts/compat";
import { Microformat } from "ts/data/microformats";
import { HCardDates } from "ts/data/types/h-card";
import { yearsSince } from "ts/ui/formatting/time";
import {
    PropertiesTable,
    PropertyRow,
} from "ts/ui/microformats/common/properties";
import { PropsOf } from "ts/ui/props";
import { DateTime, DateTimeProps } from "ts/ui/time";

export const DatesPropertiesTable = (props: PropsOf<HCardDates>) => {
    const dates = props.data;
    if (!dates) return null;
    const { birthday, anniversary } = dates;

    return (
        <PropertiesTable>
            <PropertyRow
                microformat={Microformat.Dt.Bday}
                displayName={_("hcard_dates_birthday")}
                displayValue={birthday?.map(date => (
                    <Birthday datetime={date} />
                ))}
            />

            <PropertyRow
                microformat={Microformat.Dt.Anniversary}
                displayName={_("hcard_dates_anniversary")}
                displayValue={anniversary}
            />
        </PropertiesTable>
    );
};

const Birthday = (props: DateTimeProps) => {
    const birthday = props.datetime;
    if (!birthday) return null;

    return (
        <>
            <DateTime
                title={Microformat.Dt.Bday}
                datetime={birthday}
                showTime={false}
            />{" "}
            <Age datetime={birthday} />
        </>
    );
};

const Age = (props: DateTimeProps) => {
    const { datetime } = props;
    if (!datetime) return null;

    const age = yearsSince(datetime);
    if (!age) return null;

    const ageMessage = _("hcard_age", age.toString());
    return <span>{`(${ageMessage})`}</span>;
};
