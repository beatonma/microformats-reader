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
                cls={Microformat.PlainProp.P_Gender_Identity}
                name={_("hcard_gender_identity")}
                value={genderIdentity}
            />
            <PropertyRow
                cls={Microformat.PlainProp.P_Pronouns}
                name={_("hcard_pronouns")}
                value={pronouns}
            />
            <PropertyRow
                cls={Microformat.PlainProp.P_Sex}
                name={_("hcard_sex")}
                value={sex}
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
                    cls={Microformat.PlainProp.P_Gender_Identity}
                    value={genderIdentity}
                />
                <Property
                    cls={Microformat.PlainProp.P_Pronouns}
                    value={pronouns}
                />
            </>
        );
    }

    return <Property cls={Microformat.PlainProp.P_Sex} value={sex} />;
};
