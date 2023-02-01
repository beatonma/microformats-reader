import { HCardNameDetail } from "../../../data/h-card";
import { Dropdown } from "../../dropdown";
import { _ } from "../../../compat/compat";
import React from "react";
import { PropertyDiv } from "../properties";
import { Microformats } from "../../../data/microformats";

interface NameProps {
    name?: string;
    detail?: HCardNameDetail;
}

export function Name(props: NameProps) {
    const { name, detail } = props;
    return (
        <Dropdown headerClassName={Microformats.P_Name} header={name}>
            <PropertyDiv
                cls={Microformats.P_Honorific_Prefix}
                name={_("hcard_name_honorific_prefix")}
                value={detail.honorificPrefix}
            />
            <PropertyDiv
                cls={Microformats.P_Honorific_Suffix}
                name={_("hcard_name_honorific_suffix")}
                value={detail.honorificSuffix}
            />
            <PropertyDiv
                cls={Microformats.P_Given_Name}
                name={_("hcard_name_given")}
                value={detail.givenName}
            />
            <PropertyDiv
                cls={Microformats.P_Additional_Name}
                name={_("hcard_name_additional")}
                value={detail.additionalName}
            />
            <PropertyDiv
                cls={Microformats.P_Family_Name}
                name={_("hcard_name_family")}
                value={detail.familyName}
            />
            <PropertyDiv
                cls={Microformats.P_Nickname}
                name={_("hcard_name_nickname")}
                value={detail.nickname}
            />
            <PropertyDiv
                cls={Microformats.P_Sort_String}
                name={_("hcard_name_sortby")}
                value={detail.sortBy}
            />
        </Dropdown>
    );
}
