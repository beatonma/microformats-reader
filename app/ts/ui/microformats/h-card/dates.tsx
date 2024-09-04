import React from "react";
import { _ } from "ts/compat";
import { Microformat } from "ts/data/microformats";
import { HCardDates } from "ts/data/types/h-card";
import { yearsSince } from "ts/ui/formatting/time";
import {
    CustomPropertyRow,
    displayValueProperties,
    PropertiesTable,
    PropertyRow,
} from "ts/ui/microformats/common";
import { PropsOf } from "ts/ui/props";
import { DateTime, DateTimeProps } from "ts/ui/time";
import { Row, Space } from "ts/ui/layout";

export const DatesPropertiesTable = (props: PropsOf<HCardDates>) => {
    const { birthday, anniversary } = props.data;

    return (
        <PropertiesTable>
            <CustomPropertyRow
                microformat={Microformat.Dt.Bday}
                property={{ displayName: _("hcard_dates_birthday") }}
            >
                {birthday?.map(date => <Birthday datetime={date} />)}
            </CustomPropertyRow>

            <PropertyRow
                microformat={Microformat.Dt.Anniversary}
                property={{ displayName: _("hcard_dates_anniversary") }}
                values={displayValueProperties(anniversary)}
            />
        </PropertiesTable>
    );
};

const Birthday = (props: DateTimeProps) => {
    const birthday = props.datetime;
    if (!birthday) return null;

    return (
        <Row space={Space.Char}>
            <DateTime title={Microformat.Dt.Bday} datetime={birthday} />
            <Age datetime={birthday} />
        </Row>
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
