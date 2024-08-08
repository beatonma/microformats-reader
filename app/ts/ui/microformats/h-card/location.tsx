import React, { HTMLProps } from "react";
import { _ } from "ts/compat";
import { Microformat } from "ts/data/microformats";
import { HAdrData } from "ts/data/types";
import { notNullish } from "ts/data/util/arrays";
import { formatLatLong } from "ts/ui/formatting";
import { Icon, Icons } from "ts/ui/icon";
import { LinkTo } from "ts/ui/link-to";
import {
    PropertiesTable,
    PropertyRow,
} from "ts/ui/microformats/common/properties";
import { NullablePropsOf, PropsOf } from "ts/ui/props";

export const Location = (props: NullablePropsOf<HAdrData>) => {
    const location = props.data;
    if (!location) return null;

    const summary = addressSummary(location);

    return (
        <PropertyRow
            icon={Icons.Location}
            microformat={Microformat.P.Adr}
            value={{ displayValue: summary }}
        />
    );
};

export const LocationPropertiesTable = (props: PropsOf<HAdrData>) => {
    const {
        countryName,
        extendedAddress,
        label,
        locality,
        postalCode,
        postOfficeBox,
        region,
        streetAddress,
        latitude,
        longitude,
        altitude,
    } = props.data;

    return (
        <>
            <PropertiesTable>
                <LinkToMap href={getMapsUrl(props.data)} />

                <PropertyRow
                    microformat={Microformat.P.Label}
                    property={{ displayName: _("hadr_label") }}
                    value={{ displayValue: label }}
                />
                <PropertyRow
                    microformat={Microformat.P.Post_Office_Box}
                    property={{ displayName: _("hadr_post_office_box") }}
                    value={{ displayValue: postOfficeBox }}
                />
                <PropertyRow
                    microformat={Microformat.P.Street_Address}
                    property={{ displayName: _("hadr_street_address") }}
                    value={{ displayValue: streetAddress }}
                />
                <PropertyRow
                    microformat={Microformat.P.Extended_Address}
                    property={{ displayName: _("hadr_extended_address") }}
                    value={{ displayValue: extendedAddress }}
                />
                <PropertyRow
                    microformat={Microformat.P.Locality}
                    property={{ displayName: _("hadr_locality") }}
                    value={{ displayValue: locality }}
                />
                <PropertyRow
                    microformat={Microformat.P.Region}
                    property={{ displayName: _("hadr_region") }}
                    value={{ displayValue: region }}
                />
                <PropertyRow
                    microformat={Microformat.P.Country_Name}
                    property={{ displayName: _("hadr_country_name") }}
                    value={{ displayValue: countryName }}
                />
                <PropertyRow
                    microformat={Microformat.P.Postal_Code}
                    property={{ displayName: _("hadr_postal_code") }}
                    value={{ displayValue: postalCode }}
                />
                <PropertyRow
                    microformat={Microformat.P.Latitude}
                    property={{ displayName: _("hadr_latitude") }}
                    value={{ displayValue: latitude }}
                />
                <PropertyRow
                    microformat={Microformat.P.Longitude}
                    property={{ displayName: _("hadr_longitude") }}
                    value={{ displayValue: longitude }}
                />
                <PropertyRow
                    microformat={Microformat.P.Altitude}
                    property={{ displayName: _("hadr_altitude") }}
                    value={{ displayValue: altitude }}
                />
            </PropertiesTable>
        </>
    );
};

const addressSummary = (location: HAdrData): string | null => {
    const { countryName, locality, region, latitude, longitude } = location;

    let fields: string[] = [
        locality?.[0],
        region?.[0],
        countryName?.[0],
    ].filter(notNullish);
    if (fields) {
        return fields.join(", ");
    }

    return formatLatLong(latitude, longitude) ?? null;
};

const LinkToMap = (props: HTMLProps<HTMLAnchorElement>) => {
    const { href, className, ...rest } = props;
    if (!href) return null;

    return (
        <LinkTo href={href} className="maps" {...rest}>
            <Icon icon={Icons.Map} /> Open in Google Maps
        </LinkTo>
    );
};

const getMapsUrl = (location: HAdrData): string | undefined => {
    const query = (
        formatLatLong(location.latitude, location.longitude) ??
        addressSummary(location)
    )?.replace(/\s+/g, "+");

    if (!query) return undefined;

    return `https://www.google.com/maps/search/${query}`;
};
