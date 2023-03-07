import React from "react";
import { _ } from "ts/compat";
import { Microformat } from "ts/data/microformats";
import { HCardContactData } from "ts/data/types/h-card";
import { Icons } from "ts/ui/icon";
import { InlineGroup } from "ts/ui/layout/inline-group";
import {
    PropertiesTable,
    Property,
    PropertyRow,
} from "ts/ui/microformats/common/properties";
import { PropsOf } from "ts/ui/props";

export const Contact = (props: PropsOf<HCardContactData>) => {
    const url = props.data?.url;
    if (!url) return null;

    return (
        <InlineGroup>
            <Property
                icon={Icons.Link}
                microformat={Microformat.U.Url}
                href={url}
            />
        </InlineGroup>
    );
};

export const ContactPropertiesTable = (props: PropsOf<HCardContactData>) => {
    const contact = props.data;
    if (!contact) return null;

    const { url, email, phone, impp, publicKey } = contact;

    return (
        <PropertiesTable>
            <PropertyRow
                microformat={Microformat.U.Url}
                href={url}
                displayName={_("hcard_contact_url")}
            />
            <PropertyRow
                microformat={Microformat.U.Email}
                href={email}
                displayName={_("hcard_contact_email")}
            />
            <PropertyRow
                microformat={Microformat.P.Tel}
                href={buildUri("tel:", phone)}
                displayName={_("hcard_contact_phone")}
            />
            <PropertyRow
                microformat={Microformat.U.IMPP}
                href={impp}
                displayName={_("hcard_contact_impp")}
            />
            <PropertyRow
                microformat={Microformat.U.Key}
                href={publicKey}
                displayName={_("hcard_contact_key")}
            />
        </PropertiesTable>
    );
};

const buildUri = (prefix: string, values: string[] | null): string[] | null => {
    if (values == null || values.length === 0) return null;
    return values.map(value => `${prefix}${value}`);
};
