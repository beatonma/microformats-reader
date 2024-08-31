import React from "react";
import { _ } from "ts/compat";
import { Microformat } from "ts/data/microformats";
import { HCardExtras } from "ts/data/types/h-card";
import {
    displayValueProperties,
    PropertiesTable,
    PropertyRow,
} from "ts/ui/microformats/common/properties";
import { PropsOf } from "ts/ui/props";

export const ExtrasPropertiesTable = (props: PropsOf<HCardExtras>) => {
    const { category, dietaryPreferences, sexualOrientation, uid } = props.data;

    return (
        <PropertiesTable>
            <PropertyRow
                microformat={Microformat.P.Category}
                property={{ displayName: _("hcard_extras_category") }}
                values={displayValueProperties(category)}
            />
            <PropertyRow
                microformat={Microformat.U.Uid}
                property={{ displayName: _("hcard_extras_uid") }}
                values={displayValueProperties(uid)}
            />
            <PropertyRow
                microformat={Microformat.X.DietaryPreference}
                property={{
                    displayName: _("hcard_extras_dietary_preferences"),
                }}
                values={displayValueProperties(dietaryPreferences)}
            />
            <PropertyRow
                microformat={Microformat.X.SexualOrientation}
                property={{
                    displayName: _("hcard_extras_sexual_orientation"),
                }}
                values={displayValueProperties(sexualOrientation)}
            />
        </PropertiesTable>
    );
};
