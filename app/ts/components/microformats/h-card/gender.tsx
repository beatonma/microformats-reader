import React from "react";
import { _ } from "ts/compat";
import { InlineGroup } from "ts/components/layout/inline-group";
import {
    PropertiesTable,
    Property,
    PropertyRow,
} from "ts/components/microformats/properties";
import { PropsOf } from "ts/components/props";
import { notNullish } from "ts/data/arrays";
import { Microformat } from "ts/data/microformats";
import { HCardGenderIdentity } from "ts/data/types/h-card";

export const Gender = (props: PropsOf<HCardGenderIdentity>) => {
    const identity = props.data;
    if (!identity) return null;

    return (
        <InlineGroup className="gender">
            <GenderSummary {...identity} />
        </InlineGroup>
    );
};

export const GenderPropertiesTable = (props: PropsOf<HCardGenderIdentity>) => {
    const identity = props.data;
    if (!identity) return null;
    const { genderIdentity, pronouns, sex } = identity;

    return (
        <PropertiesTable>
            <PropertyRow
                microformat={Microformat.PlainProp.P_Gender_Identity}
                displayName={_("hcard_gender_identity")}
                displayValue={genderIdentity}
            />
            <PropertyRow
                microformat={Microformat.PlainProp.P_Pronouns}
                displayName={_("hcard_pronouns")}
                displayValue={pronouns}
                allowValueAsHref={true}
            />
            <PropertyRow
                microformat={Microformat.PlainProp.P_Sex}
                displayName={_("hcard_sex")}
                displayValue={sex}
            />
        </PropertiesTable>
    );
};

const GenderSummary = (props: HCardGenderIdentity) => {
    const { genderIdentity, pronouns, sex } = props;

    if ([genderIdentity, pronouns].filter(notNullish)) {
        return (
            <>
                <Property
                    microformat={Microformat.PlainProp.P_Gender_Identity}
                    displayValue={genderIdentity?.[0]}
                />
                <Property
                    microformat={Microformat.PlainProp.P_Pronouns}
                    displayValue={pronouns?.[0]}
                    allowValueAsHref={true}
                />
            </>
        );
    }

    return (
        <Property
            microformat={Microformat.PlainProp.P_Sex}
            displayValue={sex?.[0]}
        />
    );
};
