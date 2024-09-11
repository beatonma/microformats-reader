import React from "react";
import { _ } from "ts/compat";
import { Microformat } from "ts/data/microformats";
import { HCardContactData } from "ts/data/types/h-card";
import { Icons } from "ts/ui/icon";
import {
    linkedValueProperties,
    onClickValueProperties,
    PropertiesTable,
    PropertyRow,
} from "ts/ui/microformats/common";
import { NullablePropsOf, PropsOf } from "ts/ui/props";

const ContactTableId = "hcard_contact";

export const ContactSummary = (props: NullablePropsOf<HCardContactData>) => {
    const url = props.data?.url;
    if (!url) return null;

    if (url.length > 2) {
        return (
            <PropertyRow
                icon={Icons.Link}
                microformat={Microformat.U.Url}
                values={linkedValueProperties(
                    [null, _("n_other_values", `${url.length - 1}`)],
                    [url[0], `#${ContactTableId}`],
                )}
                valuesLayout="row"
            />
        );
    }

    return (
        <PropertyRow
            icon={Icons.Link}
            microformat={Microformat.U.Url}
            values={onClickValueProperties(url)}
            valuesLayout="row"
        />
    );
};

export const ContactPropertiesTable = (props: PropsOf<HCardContactData>) => {
    const { url, email, phone, impp, publicKey } = props.data;

    return (
        <PropertiesTable id={ContactTableId}>
            <PropertyRow
                microformat={Microformat.U.Url}
                property={{ displayName: _("hcard_contact_url") }}
                values={onClickValueProperties(url)}
            />
            <PropertyRow
                microformat={Microformat.U.Email}
                property={{ displayName: _("hcard_contact_email") }}
                values={onClickValueProperties(email)}
            />
            <PropertyRow
                microformat={Microformat.P.Tel}
                property={{ displayName: _("hcard_contact_phone") }}
                values={onClickValueProperties(buildUri("tel:", phone))}
            />
            <PropertyRow
                microformat={Microformat.U.IMPP}
                property={{ displayName: _("hcard_contact_impp") }}
                values={onClickValueProperties(impp)}
            />
            <PropertyRow
                microformat={Microformat.U.Key}
                property={{ displayName: _("hcard_contact_key") }}
                values={onClickValueProperties(publicKey)}
            />
        </PropertiesTable>
    );
};

const buildUri = (prefix: string, values: string[] | null): string[] | null => {
    return (
        values
            ?.map(value =>
                value.startsWith(prefix) ? value : `${prefix}${value}`,
            )
            ?.nullIfEmpty() ?? null
    );
};
