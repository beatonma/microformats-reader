import React from "react";
import { _ } from "ts/compat";
import { InlineGroup } from "ts/components/layout/inline-group";
import {
    PropertiesTable,
    PropertyLinkDiv,
    PropertyRowLink,
} from "ts/components/microformats/properties";
import { HCardContactData } from "ts/data/h-card";
import { Microformats } from "ts/data/microformats";

export const Contact = (props: HCardContactData) => {
    if (!props) return null;

    return (
        <InlineGroup>
            <PropertyLinkDiv
                cls={Microformats.U_Url}
                href={props.url}
                value={props.url}
            />
        </InlineGroup>
    );
};

export const ContactPropertiesTable = (props: HCardContactData) => {
    return (
        <PropertiesTable>
            <PropertyRowLink
                cls={Microformats.U_Url}
                href={props.url}
                name={_("hcard_contact_url")}
                value={props.url}
            />
            <PropertyRowLink
                cls={Microformats.U_Email}
                href={props.email}
                name={_("hcard_contact_email")}
                value={props.email}
            />
            <PropertyRowLink
                cls={Microformats.P_Tel}
                href={`tel:${props.phone}`}
                name={_("hcard_contact_phone")}
                value={props.phone}
            />
            <PropertyRowLink
                cls={Microformats.U_IMPP}
                href={props.impp}
                name={_("hcard_contact_impp")}
                value={props.impp}
            />
            <PropertyRowLink
                cls={Microformats.U_Key}
                href={props.publicKey}
                name={_("hcard_contact_key")}
                value={props.publicKey}
            />
        </PropertiesTable>
    );
};
