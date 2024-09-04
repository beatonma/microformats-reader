import { NullablePropsOf } from "ts/ui/props";
import { joinNotEmpty } from "ts/data/util/arrays";
import { PropertyRow } from "ts/ui/microformats/common/properties";
import { Microformat } from "ts/data/microformats";
import { Icons } from "ts/ui/icon";
import React from "react";

export const CategoryPropertyRow = (props: NullablePropsOf<string[]>) => {
    const { data: categories } = props;

    if (categories == null) return null;

    return (
        <PropertyRow
            microformat={Microformat.P.Category}
            icon={Icons.Tag}
            values={{ displayValue: joinNotEmpty(", ", categories) }}
        />
    );
};
