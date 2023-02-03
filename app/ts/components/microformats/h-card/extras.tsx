import React from "react";
import { _ } from "ts/compat";
import {
    PropertiesTable,
    PropertyRow,
} from "ts/components/microformats/properties";
import { HCardExtras } from "ts/data/h-card";
import { Microformats } from "ts/data/microformats";

export const ExtrasPropertiesTable = (props: HCardExtras) => {
    if (!props) return null;
    const { uid, category, notes } = props;
    return (
        <PropertiesTable>
            <PropertyRow
                cls={Microformats.P_Note}
                name={_("hcard_extras_notes")}
                value={notes}
            />
            <PropertyRow
                cls={Microformats.P_Category}
                name={_("hcard_extras_category")}
                value={category}
            />
            <PropertyRow
                cls={Microformats.U_Uid}
                name={_("hcard_extras_uid")}
                value={uid}
            />
        </PropertiesTable>
    );
};
