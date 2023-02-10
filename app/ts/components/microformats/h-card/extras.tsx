import React from "react";
import {_} from "ts/compat";
import {PropertiesTable, PropertyRow,} from "ts/components/microformats/properties";
import {PropsOf} from "ts/components/props";
import {Microformats} from "ts/data/microformats";
import {HCardExtras} from "ts/data/types/h-card";

export const ExtrasPropertiesTable = (props: PropsOf<HCardExtras>) => {
    const extras = props.data;
    if (!extras) return null;
    const { uid, category, notes } = extras;

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
