import React from "react";
import { _ } from "ts/compat";
import { Microformat } from "ts/data/microformats";
import { HCardGenderIdentity } from "ts/data/types/h-card";
import { anyOf } from "ts/data/util/arrays";
import { Row } from "ts/ui/layout";
import {
    displayValueProperties,
    PropertiesTable,
    PropertyRow,
} from "ts/ui/microformats/common";
import { NullablePropsOf, PropsOf } from "ts/ui/props";

export const GenderSummary = (props: NullablePropsOf<HCardGenderIdentity>) => {
    if (props.data == null) return null;
    const { genderIdentity, pronouns, sex } = props.data;

    if (anyOf([genderIdentity, pronouns])) {
        return (
            <Row>
                <PropertyRow
                    microformat={Microformat.P.GenderIdentity}
                    values={displayValueProperties(genderIdentity)}
                    valuesLayout="row"
                />
                <PropertyRow
                    microformat={Microformat.P.Pronoun}
                    hrefMicroformat={Microformat.U.Pronoun}
                    values={displayValueProperties(pronouns)}
                    valuesLayout="row"
                />
            </Row>
        );
    }

    return (
        <PropertyRow
            microformat={Microformat.P.Sex}
            values={displayValueProperties(sex)}
            valuesLayout="row"
        />
    );
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
                microformat={Microformat.P.Pronoun}
                hrefMicroformat={Microformat.U.Pronoun}
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
