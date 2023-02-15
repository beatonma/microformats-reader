import React from "react";
import { _ } from "ts/compat";
import {
    PropertiesTable,
    PropertyRow,
} from "ts/components/microformats/properties";
import { PropsOf } from "ts/components/props";
import { Microformat } from "ts/data/microformats";
import { HCardExtras } from "ts/data/types/h-card";

export const ExtrasPropertiesTable = (props: PropsOf<HCardExtras>) => {
    const extras = props.data;
    if (!extras) return null;
    const { uid, category, notes } = extras;

    return (
        <PropertiesTable>
            <PropertyRow
                microformat={Microformat.PlainProp.P_Note}
                displayName={_("hcard_extras_notes")}
                displayValue={notes}
            />
            <PropertyRow
                microformat={Microformat.PlainProp.P_Category}
                displayName={_("hcard_extras_category")}
                displayValue={category}
            />
            <PropertyRow
                microformat={Microformat.UrlProp.U_Uid}
                displayName={_("hcard_extras_uid")}
                displayValue={uid}
            />
        </PropertiesTable>
    );
};
