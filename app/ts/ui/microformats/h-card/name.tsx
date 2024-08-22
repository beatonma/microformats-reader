import React from "react";
import { _ } from "ts/compat";
import { Microformat } from "ts/data/microformats";
import { HCardNameDetail } from "ts/data/types/h-card";
import {
    displayValueProperties,
    onClickValueProperties,
    PropertiesTable,
    PropertyRow,
} from "ts/ui/microformats/common/properties";
import { PropsOf } from "ts/ui/props";

export const Name = (props: { name: string[] | null }) => {
    const { name } = props;

    return (
        <h1>
            <PropertyRow
                microformat={Microformat.P.Name}
                values={displayValueProperties(name)}
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
                values={onClickValueProperties(sound)}
            />
            <PropertyRow
                microformat={Microformat.P.Honorific_Prefix}
                property={{ displayName: _("hcard_name_honorific_prefix") }}
                values={displayValueProperties(honorificPrefix)}
            />
            <PropertyRow
                microformat={Microformat.P.Honorific_Suffix}
                property={{ displayName: _("hcard_name_honorific_suffix") }}
                values={displayValueProperties(honorificSuffix)}
            />
            <PropertyRow
                microformat={Microformat.P.Given_Name}
                property={{ displayName: _("hcard_name_given") }}
                values={displayValueProperties(givenName)}
            />
            <PropertyRow
                microformat={Microformat.P.Additional_Name}
                property={{ displayName: _("hcard_name_additional") }}
                values={displayValueProperties(additionalName)}
            />
            <PropertyRow
                microformat={Microformat.P.Family_Name}
                property={{ displayName: _("hcard_name_family") }}
                values={displayValueProperties(familyName)}
            />
            <PropertyRow
                microformat={Microformat.P.Nickname}
                property={{ displayName: _("hcard_name_nickname") }}
                values={displayValueProperties(nickname)}
            />
            <PropertyRow
                microformat={Microformat.P.Sort_String}
                property={{ displayName: _("hcard_name_sortby") }}
                values={displayValueProperties(sortBy)}
            />
        </PropertiesTable>
    );
};
