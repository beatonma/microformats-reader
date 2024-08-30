import React from "react";
import { _ } from "ts/compat";
import { Microformat } from "ts/data/microformats";
import { HCardGenderIdentity } from "ts/data/types/h-card";
import {
    displayValueProperties,
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
                microformat={Microformat.P.GenderIdentity}
                property={{ displayName: _("hcard_gender_identity") }}
                values={displayValueProperties(genderIdentity)}
            />
            <PropertyRow
                microformat={Microformat.P.Pronouns}
                property={{ displayName: _("hcard_pronouns") }}
                values={displayValueProperties(pronouns)}
            />
            <PropertyRow
                microformat={Microformat.P.Sex}
                property={{ displayName: _("hcard_sex") }}
                values={displayValueProperties(sex)}
            />
        </PropertiesTable>
    );
};

const GenderSummary = (props: HCardGenderIdentity) => {
    const { genderIdentity, pronouns, sex } = props;

    if ([genderIdentity, pronouns].nullIfEmpty()) {
        return (
            <>
                <PropertyRow
                    microformat={Microformat.P.GenderIdentity}
                    values={displayValueProperties(genderIdentity)}
                />
                <PropertyRow
                    microformat={Microformat.P.Pronouns}
                    values={displayValueProperties(pronouns)}
                />
            </>
        );
    }

    return (
        <PropertyRow
            microformat={Microformat.P.Sex}
            values={displayValueProperties(sex)}
        />
    );
};
