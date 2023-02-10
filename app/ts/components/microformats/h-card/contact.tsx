import React from "react";
import { _ } from "ts/compat";
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
            <Property cls={Microformat.UrlProp.U_Url} href={url} value={url} />
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
                cls={Microformat.UrlProp.U_Url}
                href={url}
                name={_("hcard_contact_url")}
                value={url}
            />
            <PropertyRow
                cls={Microformat.UrlProp.U_Email}
                href={email}
                name={_("hcard_contact_email")}
                value={email}
            />
            <PropertyRow
                cls={Microformat.PlainProp.P_Tel}
                href={`tel:${phone}`}
                name={_("hcard_contact_phone")}
                value={phone}
            />
            <PropertyRow
                cls={Microformat.UrlProp.U_IMPP}
                href={impp}
                name={_("hcard_contact_impp")}
                value={impp}
            />
            <PropertyRow
                cls={Microformat.UrlProp.U_Key}
                href={publicKey}
                name={_("hcard_contact_key")}
                value={publicKey}
            />
        </PropertiesTable>
    );
};
