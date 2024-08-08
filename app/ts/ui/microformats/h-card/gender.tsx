import React from "react";
import { _ } from "ts/compat";
import { Microformat } from "ts/data/microformats";
import { HCardGenderIdentity } from "ts/data/types/h-card";
import { notNullish } from "ts/data/util/arrays";
import {
    PropertiesTable,
    PropertyRow,
} from "ts/ui/microformats/common/properties";
import { NullablePropsOf, PropsOf } from "ts/ui/props";

export const Gender = (props: NullablePropsOf<HCardGenderIdentity>) => {
    const identity = props.data;
    if (!identity) return null;

    return <GenderSummary {...identity} />;
};

export const GenderPropertiesTable = (props: PropsOf<HCardGenderIdentity>) => {
    const { genderIdentity, pronouns, sex } = props.data;

    return (
        <PropertiesTable>
            <PropertyRow
                microformat={Microformat.P.Gender_Identity}
                property={{ displayName: _("hcard_gender_identity") }}
                value={{ displayValue: genderIdentity }}
            />
            <PropertyRow
                microformat={Microformat.P.Pronouns}
                property={{ displayName: _("hcard_pronouns") }}
                value={{ displayValue: pronouns }}
            />
            <PropertyRow
                microformat={Microformat.P.Sex}
                property={{ displayName: _("hcard_sex") }}
                value={{ displayValue: sex }}
            />
        </PropertiesTable>
    );
};

const GenderSummary = (props: HCardGenderIdentity) => {
    const { genderIdentity, pronouns, sex } = props;

    if ([genderIdentity, pronouns].filter(notNullish)) {
        return (
            <>
                <PropertyRow
                    microformat={Microformat.P.Gender_Identity}
                    value={{ displayValue: genderIdentity?.[0] }}
                />
                <PropertyRow
                    microformat={Microformat.P.Pronouns}
                    value={{ displayValue: pronouns?.[0] }}
                />
            </>
        );
    }

    return (
        <PropertyRow
            microformat={Microformat.P.Sex}
            value={{ displayValue: sex?.[0] }}
        />
    );
};
