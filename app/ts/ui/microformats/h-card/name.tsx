import React from "react";
import { _ } from "ts/compat";
import { Microformat } from "ts/data/microformats";
import { Named } from "ts/data/types/common";
import { HCardNameDetail } from "ts/data/types/h-card";
import {
    PropertiesTable,
    Property,
    PropertyRow,
} from "ts/ui/microformats/common/properties";
import { PropsOf } from "ts/ui/props";

export const Name = (props: Named) => {
    const { name } = props;

    return (
        <h1>
            <Property microformat={Microformat.P.Name} displayValue={name} />
        </h1>
    );
};

export const NamePropertiesTable = (props: PropsOf<HCardNameDetail>) => {
    const {
        sound,
        honorificPrefix,
        honorificSuffix,
        givenName,
        additionalName,
        familyName,
        nickname,
        sortBy,
    } = props.data;
    return (
        <PropertiesTable>
            <PropertyRow
                href={sound}
                microformat={Microformat.U.Sound}
                displayName={_("hcard_name_sound")}
            />
            <PropertyRow
                microformat={Microformat.P.Honorific_Prefix}
                displayName={_("hcard_name_honorific_prefix")}
                displayValue={honorificPrefix}
            />
            <PropertyRow
                microformat={Microformat.P.Honorific_Suffix}
                displayName={_("hcard_name_honorific_suffix")}
                displayValue={honorificSuffix}
            />
            <PropertyRow
                microformat={Microformat.P.Given_Name}
                displayName={_("hcard_name_given")}
                displayValue={givenName}
            />
            <PropertyRow
                microformat={Microformat.P.Additional_Name}
                displayName={_("hcard_name_additional")}
                displayValue={additionalName}
            />
            <PropertyRow
                microformat={Microformat.P.Family_Name}
                displayName={_("hcard_name_family")}
                displayValue={familyName}
            />
            <PropertyRow
                microformat={Microformat.P.Nickname}
                displayName={_("hcard_name_nickname")}
                displayValue={nickname}
            />
            <PropertyRow
                microformat={Microformat.P.Sort_String}
                displayName={_("hcard_name_sortby")}
                displayValue={sortBy}
            />
        </PropertiesTable>
    );
};
