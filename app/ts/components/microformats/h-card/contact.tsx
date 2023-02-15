import React from "react";
import { _ } from "ts/compat";
import { Icons } from "ts/components/icon";
import { InlineGroup } from "ts/components/layout/inline-group";
import {
    PropertiesTable,
    Property,
    PropertyRow,
} from "ts/components/microformats/properties";
import { PropsOf } from "ts/components/props";
import { Microformat } from "ts/data/microformats";
import { HCardContactData } from "ts/data/types/h-card";

export const Contact = (props: PropsOf<HCardContactData>) => {
    const url = props.data?.url;
    if (!url) return null;

    return (
        <InlineGroup>
            <Property
                icon={Icons.Link}
                microformat={Microformat.UrlProp.U_Url}
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
                microformat={Microformat.UrlProp.U_Url}
                href={url}
                displayName={_("hcard_contact_url")}
            />
            <PropertyRow
                microformat={Microformat.UrlProp.U_Email}
                href={email}
                displayName={_("hcard_contact_email")}
            />
            <PropertyRow
                microformat={Microformat.PlainProp.P_Tel}
                href={buildUri("tel:", phone)}
                displayName={_("hcard_contact_phone")}
            />
            <PropertyRow
                microformat={Microformat.UrlProp.U_IMPP}
                href={impp}
                displayName={_("hcard_contact_impp")}
            />
            <PropertyRow
                microformat={Microformat.UrlProp.U_Key}
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
