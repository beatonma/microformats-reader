import React from "react";
import { _ } from "ts/compat";
import { Microformat } from "ts/data/microformats";
import { HCardContactData } from "ts/data/types/h-card";
import { Icons } from "ts/ui/icon";
import {
    PropertiesTable,
    PropertyRow,
} from "ts/ui/microformats/common/properties";
import { NullablePropsOf, PropsOf } from "ts/ui/props";

export const Contact = (props: NullablePropsOf<HCardContactData>) => {
    const url = props.data?.url;
    if (!url) return null;

    return (
        <PropertyRow
            icon={Icons.Link}
            microformat={Microformat.U.Url}
            value={{ href: url }}
        />
    );
};

export const ContactPropertiesTable = (props: PropsOf<HCardContactData>) => {
    const { url, email, phone, impp, publicKey } = props.data;

    return (
        <PropertiesTable>
            <PropertyRow
                microformat={Microformat.U.Url}
                value={{ href: url }}
                property={{ displayName: _("hcard_contact_url") }}
            />
            <PropertyRow
                microformat={Microformat.U.Email}
                value={{ href: email }}
                property={{ displayName: _("hcard_contact_email") }}
            />
            <PropertyRow
                microformat={Microformat.P.Tel}
                value={{ href: buildUri("tel:", phone) }}
                property={{ displayName: _("hcard_contact_phone") }}
            />
            <PropertyRow
                microformat={Microformat.U.IMPP}
                value={{ href: impp }}
                property={{ displayName: _("hcard_contact_impp") }}
            />
            <PropertyRow
                microformat={Microformat.U.Key}
                value={{ href: publicKey }}
                property={{ displayName: _("hcard_contact_key") }}
            />
        </PropertiesTable>
    );
};

const buildUri = (prefix: string, values: string[] | null): string[] | null => {
    if (values == null || values.length === 0) return null;
    return values.map(value =>
        value.startsWith(prefix) ? value : `${prefix}${value}`,
    );
};
