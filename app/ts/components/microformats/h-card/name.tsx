import React from "react";
import { _ } from "ts/compat";
import {
    PropertiesTable,
    Property,
    PropertyRow,
} from "ts/components/microformats/properties";
import { HCardNameDetail } from "ts/data/h-card";
import { Microformats } from "ts/data/microformats";

interface NameDetailProps {
    name?: string;
    detail?: HCardNameDetail;
}

export const Name = (props: NameDetailProps) => {
    const { name } = props;

    return <Property cls={Microformats.P_Name} value={name} />;
};

export const NamePropertiesTable = (props: NameDetailProps) => {
    const { detail } = props;
    if (detail == null) return null;

    return (
        <PropertiesTable>
            <PropertyRow
                href={detail.sound}
                cls={Microformats.U_Sound}
                name={_("hcard_name_sound")}
                value={detail.sound}
            />
            <PropertyRow
                cls={Microformats.P_Honorific_Prefix}
                name={_("hcard_name_honorific_prefix")}
                value={detail.honorificPrefix}
            />
            <PropertyRow
                cls={Microformats.P_Honorific_Suffix}
                name={_("hcard_name_honorific_suffix")}
                value={detail.honorificSuffix}
            />
            <PropertyRow
                cls={Microformats.P_Given_Name}
                name={_("hcard_name_given")}
                value={detail.givenName}
            />
            <PropertyRow
                cls={Microformats.P_Additional_Name}
                name={_("hcard_name_additional")}
                value={detail.additionalName}
            />
            <PropertyRow
                cls={Microformats.P_Family_Name}
                name={_("hcard_name_family")}
                value={detail.familyName}
            />
            <PropertyRow
                cls={Microformats.P_Nickname}
                name={_("hcard_name_nickname")}
                value={detail.nickname}
            />
            <PropertyRow
                cls={Microformats.P_Sort_String}
                name={_("hcard_name_sortby")}
                value={detail.sortBy}
            />
        </PropertiesTable>
    );
};
