import React from "react";
import { _ } from "ts/compat";
import { Microformat } from "ts/data/microformats";
import { HCardExtras } from "ts/data/types/h-card";
import { PropertiesTable } from "ts/ui/microformats/common/properties";
import { PropsOf } from "ts/ui/props";

export const ExtrasPropertiesTable = (
    props: PropsOf<HCardExtras> & PropertiesTable.TableProps,
) => {
    const { category, uid } = props.data;

    return (
        <PropertiesTable.Table inlineTableData={props.inlineTableData}>
            <PropertiesTable.PropertyRow
                microformat={Microformat.P.Category}
                displayName={_("hcard_extras_category")}
                displayValue={category}
            />
            <PropertiesTable.PropertyRow
                microformat={Microformat.U.Uid}
                displayName={_("hcard_extras_uid")}
                displayValue={uid}
            />
        </PropertiesTable.Table>
    );
};
