import React from "react";
import { _ } from "ts/compat";
import { Microformat } from "ts/data/microformats";
import { Named } from "ts/data/types/common";
import { HCardNameDetail } from "ts/data/types/h-card";
import {
    PropertiesTable,
    PropertyRow,
} from "ts/ui/microformats/common/properties";
import { PropsOf } from "ts/ui/props";

export const Name = (props: Named) => {
    const { name } = props;

    return (
        <h1>
            <PropertyRow microformat={Microformat.P.Name} displayValue={name} />
        </h1>
    );
};

export const NamePropertiesTable = (
    props: PropsOf<HCardNameDetail> & PropertiesTable.TableProps,
) => {
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
        <PropertiesTable.Table inlineTableData={props.inlineTableData}>
            <PropertiesTable.PropertyRow
                href={sound}
                microformat={Microformat.U.Sound}
                displayName={_("hcard_name_sound")}
            />
            <PropertiesTable.PropertyRow
                microformat={Microformat.P.Honorific_Prefix}
                displayName={_("hcard_name_honorific_prefix")}
                displayValue={honorificPrefix}
            />
            <PropertiesTable.PropertyRow
                microformat={Microformat.P.Honorific_Suffix}
                displayName={_("hcard_name_honorific_suffix")}
                displayValue={honorificSuffix}
            />
            <PropertiesTable.PropertyRow
                microformat={Microformat.P.Given_Name}
                displayName={_("hcard_name_given")}
                displayValue={givenName}
            />
            <PropertiesTable.PropertyRow
                microformat={Microformat.P.Additional_Name}
                displayName={_("hcard_name_additional")}
                displayValue={additionalName}
            />
            <PropertiesTable.PropertyRow
                microformat={Microformat.P.Family_Name}
                displayName={_("hcard_name_family")}
                displayValue={familyName}
            />
            <PropertiesTable.PropertyRow
                microformat={Microformat.P.Nickname}
                displayName={_("hcard_name_nickname")}
                displayValue={nickname}
            />
            <PropertiesTable.PropertyRow
                microformat={Microformat.P.Sort_String}
                displayName={_("hcard_name_sortby")}
                displayValue={sortBy}
            />
        </PropertiesTable.Table>
    );
};
