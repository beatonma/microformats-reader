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

    return <Property cls={Microformat.PlainProp.P_Name} value={name} />;
};

export const NamePropertiesTable = (props: PropsOf<HCardNameDetail>) => {
    const detail = props.data;
    if (detail == null) return null;

    return (
        <PropertiesTable>
            <PropertyRow
                href={detail.sound}
                cls={Microformat.UrlProp.U_Sound}
                name={_("hcard_name_sound")}
                value={detail.sound}
            />
            <PropertyRow
                cls={Microformat.PlainProp.P_Honorific_Prefix}
                name={_("hcard_name_honorific_prefix")}
                value={detail.honorificPrefix}
            />
            <PropertyRow
                cls={Microformat.PlainProp.P_Honorific_Suffix}
                name={_("hcard_name_honorific_suffix")}
                value={detail.honorificSuffix}
            />
            <PropertyRow
                cls={Microformat.PlainProp.P_Given_Name}
                name={_("hcard_name_given")}
                value={detail.givenName}
            />
            <PropertyRow
                cls={Microformat.PlainProp.P_Additional_Name}
                name={_("hcard_name_additional")}
                value={detail.additionalName}
            />
            <PropertyRow
                cls={Microformat.PlainProp.P_Family_Name}
                name={_("hcard_name_family")}
                value={detail.familyName}
            />
            <PropertyRow
                cls={Microformat.PlainProp.P_Nickname}
                name={_("hcard_name_nickname")}
                value={detail.nickname}
            />
            <PropertyRow
                cls={Microformat.PlainProp.P_Sort_String}
                name={_("hcard_name_sortby")}
                value={detail.sortBy}
            />
        </PropertiesTable>
    );
};
