import React from "react";
import { _ } from "ts/compat";
import { Dropdown } from "ts/components/layout/dropdown";
import {
    PropertiesTable,
    PropertyDiv,
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

    return <PropertyDiv cls={Microformats.P_Name} value={name} />;
};

export const NameDetail = (props: NameDetailProps) => {
    const { name, detail } = props;
    return (
        <Dropdown
            headerClassName={Microformats.P_Name}
            header={name}
            title={Microformats.P_Name}
        >
            <NameDetailTable detail={detail} />
        </Dropdown>
    );
};

const NameDetailTable = (props: NameDetailProps) => {
    const { detail } = props;
    if (detail == null) return null;

    return (
        <PropertiesTable>
            <PropertyRow
                cls={Microformats.P_Honorific_Prefix}
                name={_("hcard_name_honorific_prefix")}
                value={detail?.honorificPrefix}
            />
            <PropertyRow
                cls={Microformats.P_Honorific_Suffix}
                name={_("hcard_name_honorific_suffix")}
                value={detail?.honorificSuffix}
            />
            <PropertyRow
                cls={Microformats.P_Given_Name}
                name={_("hcard_name_given")}
                value={detail?.givenName}
            />
            <PropertyRow
                cls={Microformats.P_Additional_Name}
                name={_("hcard_name_additional")}
                value={detail?.additionalName}
            />
            <PropertyRow
                cls={Microformats.P_Family_Name}
                name={_("hcard_name_family")}
                value={detail?.familyName}
            />
            <PropertyRow
                cls={Microformats.P_Nickname}
                name={_("hcard_name_nickname")}
                value={detail?.nickname}
            />
            <PropertyRow
                cls={Microformats.P_Sort_String}
                name={_("hcard_name_sortby")}
                value={detail?.sortBy}
            />
        </PropertiesTable>
    );
};
