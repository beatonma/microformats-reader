import React from "react";
import { _ } from "ts/compat";
import { Dropdown } from "ts/components/dropdown";
import {
    PropertiesTable,
    PropertyDiv,
    PropertyRow,
} from "ts/components/microformats/properties";
import { HCardNameDetail } from "ts/data/h-card";
import { Microformats } from "ts/data/microformats";

interface NameProps {
    name?: string;
    detail?: HCardNameDetail;
}

export function Name(props: NameProps) {
    const { name, detail } = props;
    return (
        <Dropdown
            headerClassName={Microformats.P_Name}
            header={name}
            title={Microformats.P_Name}
        >
            <PropertiesTable>
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
            {/*<PropertyDiv*/}
            {/*    cls={Microformats.P_Honorific_Prefix}*/}
            {/*    name={_("hcard_name_honorific_prefix")}*/}
            {/*    value={detail.honorificPrefix}*/}
            {/*/>*/}
            {/*<PropertyDiv*/}
            {/*    cls={Microformats.P_Honorific_Suffix}*/}
            {/*    name={_("hcard_name_honorific_suffix")}*/}
            {/*    value={detail.honorificSuffix}*/}
            {/*/>*/}
            {/*<PropertyDiv*/}
            {/*    cls={Microformats.P_Given_Name}*/}
            {/*    name={_("hcard_name_given")}*/}
            {/*    value={detail.givenName}*/}
            {/*/>*/}
            {/*<PropertyDiv*/}
            {/*    cls={Microformats.P_Additional_Name}*/}
            {/*    name={_("hcard_name_additional")}*/}
            {/*    value={detail.additionalName}*/}
            {/*/>*/}
            {/*<PropertyDiv*/}
            {/*    cls={Microformats.P_Family_Name}*/}
            {/*    name={_("hcard_name_family")}*/}
            {/*    value={detail.familyName}*/}
            {/*/>*/}
            {/*<PropertyDiv*/}
            {/*    cls={Microformats.P_Nickname}*/}
            {/*    name={_("hcard_name_nickname")}*/}
            {/*    value={detail.nickname}*/}
            {/*/>*/}
            {/*<PropertyDiv*/}
            {/*    cls={Microformats.P_Sort_String}*/}
            {/*    name={_("hcard_name_sortby")}*/}
            {/*    value={detail.sortBy}*/}
            {/*/>*/}
        </Dropdown>
    );
}
