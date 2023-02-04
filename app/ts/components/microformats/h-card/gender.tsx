import React from "react";
import { _ } from "ts/compat";
import { InlineGroup } from "ts/components/layout/inline-group";
import {
    PropertiesTable,
    Property,
    PropertyRow,
} from "ts/components/microformats/properties";
import { HCardGenderIdentity } from "ts/data/h-card";
import { Microformats } from "ts/data/microformats";

export const Gender = (props: HCardGenderIdentity | null) => {
    if (!props) return null;

    return (
        <InlineGroup className="gender">
            <GenderSummary {...props} />
        </InlineGroup>
    );
};

export const GenderPropertiesTable = (props: HCardGenderIdentity | null) => {
    if (!props) return null;
    const { genderIdentity, pronouns, sex } = props;
    return (
        <PropertiesTable>
            <PropertyRow
                cls={Microformats.P_Gender_Identity}
                name={_("hcard_gender_identity")}
                value={genderIdentity}
            />
            <PropertyRow
                cls={Microformats.P_Pronouns}
                name={_("hcard_pronouns")}
                value={pronouns}
            />
            <PropertyRow
                cls={Microformats.P_Sex}
                name={_("hcard_sex")}
                value={sex}
            />
        </PropertiesTable>
    );
};

const GenderSummary = (props: HCardGenderIdentity) => {
    const { genderIdentity, pronouns, sex } = props;

    const gender = [genderIdentity, pronouns].filter(Boolean);
    if (gender.filter(Boolean)) {
        return (
            <>
                <Property
                    cls={Microformats.P_Gender_Identity}
                    value={genderIdentity}
                />
                <Property cls={Microformats.P_Pronouns} value={pronouns} />
            </>
        );
    }

    return <Property cls={Microformats.P_Sex} value={sex} />;
};
