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
            <PropertyRow
                microformat={Microformat.P.Name}
                value={{ displayValue: name }}
            />
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
                microformat={Microformat.U.Sound}
                property={{ displayName: _("hcard_name_sound") }}
                value={{ href: sound }}
            />
            <PropertyRow
                microformat={Microformat.P.Honorific_Prefix}
                property={{ displayName: _("hcard_name_honorific_prefix") }}
                value={{ displayValue: honorificPrefix }}
            />
            <PropertyRow
                microformat={Microformat.P.Honorific_Suffix}
                property={{ displayName: _("hcard_name_honorific_suffix") }}
                value={{ displayValue: honorificSuffix }}
            />
            <PropertyRow
                microformat={Microformat.P.Given_Name}
                property={{ displayName: _("hcard_name_given") }}
                value={{ displayValue: givenName }}
            />
            <PropertyRow
                microformat={Microformat.P.Additional_Name}
                property={{ displayName: _("hcard_name_additional") }}
                value={{ displayValue: additionalName }}
            />
            <PropertyRow
                microformat={Microformat.P.Family_Name}
                property={{ displayName: _("hcard_name_family") }}
                value={{ displayValue: familyName }}
            />
            <PropertyRow
                microformat={Microformat.P.Nickname}
                property={{ displayName: _("hcard_name_nickname") }}
                value={{ displayValue: nickname }}
            />
            <PropertyRow
                microformat={Microformat.P.Sort_String}
                property={{ displayName: _("hcard_name_sortby") }}
                value={{ displayValue: sortBy }}
            />
        </PropertiesTable>
    );
};
