import React from "react";
import { Microformat } from "ts/data/microformats";
import { isEmptyOrNull } from "ts/data/util/arrays";
import { Icons } from "ts/ui/icon";
import { Property } from "ts/ui/microformats/common/properties";
import { NullablePropsOf } from "ts/ui/props";

export const Categories = (props: NullablePropsOf<string[]>) => {
    const { data: categories } = props;

    if (isEmptyOrNull(categories)) return null;

    return (
        <Property
            microformat={Microformat.P.Category}
            icon={Icons.Tag}
            displayValue={categories.join(", ")}
        />
    );
};
