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
    const detail = props.data;
    if (detail == null) return null;

    return (
        <PropertiesTable>
            <PropertyRow
                href={detail.sound}
                microformat={Microformat.U.Sound}
                displayName={_("hcard_name_sound")}
            />
            <PropertyRow
                microformat={Microformat.P.Honorific_Prefix}
                displayName={_("hcard_name_honorific_prefix")}
                displayValue={detail.honorificPrefix}
            />
            <PropertyRow
                microformat={Microformat.P.Honorific_Suffix}
                displayName={_("hcard_name_honorific_suffix")}
                displayValue={detail.honorificSuffix}
            />
            <PropertyRow
                microformat={Microformat.P.Given_Name}
                displayName={_("hcard_name_given")}
                displayValue={detail.givenName}
            />
            <PropertyRow
                microformat={Microformat.P.Additional_Name}
                displayName={_("hcard_name_additional")}
                displayValue={detail.additionalName}
            />
            <PropertyRow
                microformat={Microformat.P.Family_Name}
                displayName={_("hcard_name_family")}
                displayValue={detail.familyName}
            />
            <PropertyRow
                microformat={Microformat.P.Nickname}
                displayName={_("hcard_name_nickname")}
                displayValue={detail.nickname}
            />
            <PropertyRow
                microformat={Microformat.P.Sort_String}
                displayName={_("hcard_name_sortby")}
                displayValue={detail.sortBy}
            />
        </PropertiesTable>
    );
};
