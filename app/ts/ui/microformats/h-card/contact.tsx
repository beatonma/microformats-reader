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
            href={url}
        />
    );
};

export const ContactPropertiesTable = (
    props: PropsOf<HCardContactData> & PropertiesTable.TableProps,
) => {
    const { url, email, phone, impp, publicKey } = props.data;

    return (
        <PropertiesTable.Table inlineTableData={props.inlineTableData}>
            <PropertiesTable.PropertyRow
                microformat={Microformat.U.Url}
                href={url}
                displayName={_("hcard_contact_url")}
            />
            <PropertiesTable.PropertyRow
                microformat={Microformat.U.Email}
                href={email}
                displayName={_("hcard_contact_email")}
            />
            <PropertiesTable.PropertyRow
                microformat={Microformat.P.Tel}
                href={buildUri("tel:", phone)}
                displayName={_("hcard_contact_phone")}
            />
            <PropertiesTable.PropertyRow
                microformat={Microformat.U.IMPP}
                href={impp}
                displayName={_("hcard_contact_impp")}
            />
            <PropertiesTable.PropertyRow
                microformat={Microformat.U.Key}
                href={publicKey}
                displayName={_("hcard_contact_key")}
            />
        </PropertiesTable.Table>
    );
};

const buildUri = (prefix: string, values: string[] | null): string[] | null => {
    if (values == null || values.length === 0) return null;
    return values.map(value => `${prefix}${value}`);
};
