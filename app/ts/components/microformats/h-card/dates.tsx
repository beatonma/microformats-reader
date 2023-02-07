import React from "react";
import { _ } from "ts/compat";
import { Icons } from "ts/components/icon";
import { InlineGroup } from "ts/components/layout/inline-group";
import {
    PropertiesTable,
    Property,
    PropertyRow,
} from "ts/components/microformats/properties";
import { HCardDates } from "ts/data/h-card";
import { Microformats } from "ts/data/microformats";
import { formatLongDate } from "ts/formatting";

export const Dates = (props: HCardDates) => {
    if (!props) return null;

    return <Birthday {...props} />;
};

export const DatesPropertiesTable = (props: HCardDates) => {
    if (!props) return null;
    const { birthday, anniversary } = props;

    return (
        <PropertiesTable>
            <PropertyRow
                cls={Microformats.Dt_Bday}
                name={_("hcard_dates_birthday")}
                value={
                    <>
                        <time dateTime={birthday}>
                            {formatLongDate(birthday)}
                        </time>{" "}
                        <Age birthday={birthday} />
                    </>
                }
            />
            <PropertyRow
                cls={Microformats.Dt_Anniversary}
                name={_("hcard_dates_anniversary")}
                value={
                    <>
                        <time dateTime={anniversary}>
                            {formatLongDate(anniversary)}
                        </time>
                    </>
                }
            />
        </PropertiesTable>
    );
};

const Birthday = (props: HCardDates) => {
    const { birthday } = props;
    if (!birthday) return null;

    return (
        <InlineGroup>
            <Property
                cls={Microformats.Dt_Bday}
                icon={Icons.Birthday}
                value={
                    <>
                        <time dateTime={birthday}>
                            {formatLongDate(birthday)}
                        </time>{" "}
                        <Age birthday={birthday} />
                    </>
                }
            />
        </InlineGroup>
    );
};

const Anniversary = (props: HCardDates) => {
    const { anniversary } = props;
    return (
        <InlineGroup>
            <Property
                cls={Microformats.Dt_Anniversary}
                icon={Icons.Anniversary}
                value={
                    <time dateTime={anniversary}>
                        {formatLongDate(anniversary)}
                    </time>
                }
            />
        </InlineGroup>
    );
};

const Age = (props: HCardDates) => {
    const { birthday } = props;
    const age = yearsSince(birthday);
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
