import React from "react";
import { _ } from "ts/compat";
import { InlineGroup } from "ts/components/layout/inline-group";
import {
    PropertiesTable,
    PropertyRow,
    PropertySpan,
} from "ts/components/microformats/properties";
import { GenderIdentity } from "ts/data/h-card";
import { Microformats } from "ts/data/microformats";

interface GenderProps {
    gender: GenderIdentity;
}
export const Gender = (props: GenderProps) => {
    const { gender } = props;
    if (!gender) return null;

    return (
        <InlineGroup className="gender">
            <GenderSummary {...gender} />
        </InlineGroup>
    );
};

export const GenderDetail = (props: GenderProps) => {
    if (!props.gender) return null;
    const { genderIdentity, pronouns, sex } = props.gender;
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

const GenderSummary = (props: GenderIdentity) => {
    const { genderIdentity, pronouns, sex } = props;

    const gender = [genderIdentity, pronouns].filter(Boolean);
    if (gender.filter(Boolean)) {
        return (
            <>
                <PropertySpan
                    cls={Microformats.P_Gender_Identity}
                    value={genderIdentity}
                />
                <PropertySpan cls={Microformats.P_Pronouns} value={pronouns} />
            </>
        );
    }

    return <PropertySpan cls={Microformats.P_Sex} value={sex} />;
};
