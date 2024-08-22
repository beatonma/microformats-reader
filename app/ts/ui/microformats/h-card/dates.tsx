import React from "react";
import { _ } from "ts/compat";
import { Microformat } from "ts/data/microformats";
import { HCardDates } from "ts/data/types/h-card";
import { yearsSince } from "ts/ui/formatting/time";
import {
    displayValueProperties,
    PropertiesTable,
    PropertyRow,
} from "ts/ui/microformats/common/properties";
import { PropsOf } from "ts/ui/props";
import { DateTime, DateTimeProps } from "ts/ui/time";
import { Row, Space } from "ts/ui/layout";

export const DatesPropertiesTable = (props: PropsOf<HCardDates>) => {
    const { birthday, anniversary } = props.data;

    return (
        <PropertiesTable>
            <PropertyRow
                microformat={Microformat.Dt.Bday}
                property={{ displayName: _("hcard_dates_birthday") }}
                values={birthday?.map(date => ({
                    displayValue: <Birthday datetime={date} />,
                }))}
            />

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
            <DateTime
                title={Microformat.Dt.Bday}
                datetime={birthday}
                showTime={false}
            />
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
