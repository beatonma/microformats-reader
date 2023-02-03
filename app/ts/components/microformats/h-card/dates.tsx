import React from "react";
import { _ } from "ts/compat";
import { Icons } from "ts/components/icons";
import { InlineGroup } from "ts/components/layout/inline-group";
import { PropertyDiv } from "ts/components/microformats/properties";
import { HCardDates } from "ts/data/h-card";
import { Microformats } from "ts/data/microformats";
import { formatLongDate } from "ts/formatting";

export const Dates = (props: HCardDates) => {
    if (!props) return null;

    return <Birthday {...props} />;
};

export const DatesDetail = (props: HCardDates) => {
    if (!props) return null;

    return (
        <div className="hcard-dates">
            <Birthday {...props} />
            <Anniversary {...props} />
        </div>
    );
};

const Birthday = (props: HCardDates) => {
    const { birthday } = props;
    if (!birthday) return null;

    return (
        <InlineGroup>
            <PropertyDiv
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
            <PropertyDiv
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
