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

export const GenderPropertiesTable = (
    props: PropsOf<HCardGenderIdentity> & PropertiesTable.TableProps,
) => {
    const { genderIdentity, pronouns, sex } = props.data;

    return (
        <PropertiesTable.Table inlineTableData={props.inlineTableData}>
            <PropertiesTable.PropertyRow
                microformat={Microformat.P.Gender_Identity}
                displayName={_("hcard_gender_identity")}
                displayValue={genderIdentity}
            />
            <PropertiesTable.PropertyRow
                microformat={Microformat.P.Pronouns}
                displayName={_("hcard_pronouns")}
                displayValue={pronouns}
            />
            <PropertiesTable.PropertyRow
                microformat={Microformat.P.Sex}
                displayName={_("hcard_sex")}
                displayValue={sex}
            />
        </PropertiesTable.Table>
    );
};

const GenderSummary = (props: HCardGenderIdentity) => {
    const { genderIdentity, pronouns, sex } = props;

    if ([genderIdentity, pronouns].filter(notNullish)) {
        return (
            <>
                <PropertyRow
                    microformat={Microformat.P.Gender_Identity}
                    displayValue={genderIdentity?.[0]}
                />
                <PropertyRow
                    microformat={Microformat.P.Pronouns}
                    displayValue={pronouns?.[0]}
                />
            </>
        );
    }

    return (
        <PropertyRow microformat={Microformat.P.Sex} displayValue={sex?.[0]} />
    );
};
