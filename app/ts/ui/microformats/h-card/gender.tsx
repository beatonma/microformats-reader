import React from "react";
import { _ } from "ts/compat";
import { Microformat } from "ts/data/microformats";
import { HCardGenderIdentity } from "ts/data/types/h-card";
import { notNullish } from "ts/data/util/arrays";
import { InlineGroup } from "ts/ui/layout/inline-group";
import {
    PropertiesTable,
    Property,
    PropertyRow,
} from "ts/ui/microformats/properties";
import { PropsOf } from "ts/ui/props";

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
                microformat={Microformat.P.Gender_Identity}
                displayName={_("hcard_gender_identity")}
                displayValue={genderIdentity}
            />
            <PropertyRow
                microformat={Microformat.P.Pronouns}
                displayName={_("hcard_pronouns")}
                displayValue={pronouns}
                allowValueAsHref={true}
            />
            <PropertyRow
                microformat={Microformat.P.Sex}
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
                    microformat={Microformat.P.Gender_Identity}
                    displayValue={genderIdentity?.[0]}
                />
                <Property
                    microformat={Microformat.P.Pronouns}
                    displayValue={pronouns?.[0]}
                    allowValueAsHref={true}
                />
            </>
        );
    }

    return <Property microformat={Microformat.P.Sex} displayValue={sex?.[0]} />;
};