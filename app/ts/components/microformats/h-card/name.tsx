import React from "react";
import { _ } from "ts/compat";
import {
    PropertiesTable,
    Property,
    PropertyRow,
} from "ts/components/microformats/properties";
import { PropsOf } from "ts/components/props";
import { Named } from "ts/data/common";
import { Microformat } from "ts/data/microformats";
import { HCardNameDetail } from "ts/data/types/h-card";

export const Name = (props: Named) => {
    const { name } = props;

    return (
        <Property
            microformat={Microformat.PlainProp.P_Name}
            displayValue={name}
        />
    );
};

export const NamePropertiesTable = (props: PropsOf<HCardNameDetail>) => {
    const detail = props.data;
    if (detail == null) return null;

    return (
        <PropertiesTable>
            <PropertyRow
                href={detail.sound}
                microformat={Microformat.UrlProp.U_Sound}
                displayName={_("hcard_name_sound")}
            />
            <PropertyRow
                microformat={Microformat.PlainProp.P_Honorific_Prefix}
                displayName={_("hcard_name_honorific_prefix")}
                displayValue={detail.honorificPrefix}
            />
            <PropertyRow
                microformat={Microformat.PlainProp.P_Honorific_Suffix}
                displayName={_("hcard_name_honorific_suffix")}
                displayValue={detail.honorificSuffix}
            />
            <PropertyRow
                microformat={Microformat.PlainProp.P_Given_Name}
                displayName={_("hcard_name_given")}
                displayValue={detail.givenName}
            />
            <PropertyRow
                microformat={Microformat.PlainProp.P_Additional_Name}
                displayName={_("hcard_name_additional")}
                displayValue={detail.additionalName}
            />
            <PropertyRow
                microformat={Microformat.PlainProp.P_Family_Name}
                displayName={_("hcard_name_family")}
                displayValue={detail.familyName}
            />
            <PropertyRow
                microformat={Microformat.PlainProp.P_Nickname}
                displayName={_("hcard_name_nickname")}
                displayValue={detail.nickname}
            />
            <PropertyRow
                microformat={Microformat.PlainProp.P_Sort_String}
                displayName={_("hcard_name_sortby")}
                displayValue={detail.sortBy}
            />
        </PropertiesTable>
    );
};
