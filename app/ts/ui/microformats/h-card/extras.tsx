import React from "react";
import { _ } from "ts/compat";
import { Microformat } from "ts/data/microformats";
import { HCardExtras } from "ts/data/types/h-card";
import {
    PropertiesTable,
    PropertyRow,
} from "ts/ui/microformats/common/properties";
import { PropsOf } from "ts/ui/props";

export const ExtrasPropertiesTable = (props: PropsOf<HCardExtras>) => {
    const { category, uid } = props.data;

    return (
        <PropertiesTable>
            <PropertyRow
                microformat={Microformat.P.Category}
                property={{ displayName: _("hcard_extras_category") }}
                value={{ displayValue: category }}
            />
            <PropertyRow
                microformat={Microformat.U.Uid}
                property={{ displayName: _("hcard_extras_uid") }}
                value={{ displayValue: uid }}
            />
        </PropertiesTable>
    );
};
