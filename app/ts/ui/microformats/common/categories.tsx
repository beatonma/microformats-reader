import React from "react";
import { Microformat } from "ts/data/microformats";
import { isEmptyOrNull, joinNotEmpty } from "ts/data/util/arrays";
import { Icons } from "ts/ui/icon";
import { PropertyRow } from "ts/ui/microformats/common/properties";
import { NullablePropsOf } from "ts/ui/props";

export const Categories = (props: NullablePropsOf<string[]>) => {
    const { data: categories } = props;

    if (isEmptyOrNull(categories)) return null;

    return (
        <PropertyRow
            className="categories"
            microformat={Microformat.P.Category}
            icon={Icons.Tag}
            values={{ displayValue: joinNotEmpty(", ", categories) }}
        />
    );
};
