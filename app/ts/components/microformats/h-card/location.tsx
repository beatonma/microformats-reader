import React, { HTMLProps } from "react";
import { _ } from "ts/compat";
import { Icon, Icons } from "ts/components/icon";
import { InlineGroup } from "ts/components/layout/inline-group";
import { LinkTo } from "ts/components/link-to";
import {
    PropertiesTable,
    Property,
    PropertyRow,
} from "ts/components/microformats/properties";
import { PropsOf } from "ts/components/props";
import { notNullish } from "ts/data/arrays";
import { Microformat } from "ts/data/microformats";
import { HAdrData } from "ts/data/types";
import { formatLatLong } from "ts/formatting";
import "./location.scss";

export const Location = (props: PropsOf<HAdrData>) => {
    const location = props.data;
    if (!location) return null;

    const summary = addressSummary(location);

    return (
        <InlineGroup className="location" title={_("location")}>
            <Property
                icon={Icons.Location}
                microformat={Microformat.PlainProp.P_Adr}
                displayValue={summary}
            />
        </InlineGroup>
    );
};

export const LocationPropertiesTable = (props: PropsOf<HAdrData>) => {
    const location = props.data;

    if (!location) return null;

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
    } = location;

    return (
        <>
            <LinkToMap href={getMapsUrl(location)} />
            <PropertiesTable>
                <PropertyRow
                    microformat={Microformat.PlainProp.P_Label}
                    displayName={_("hadr_label")}
                    displayValue={label}
                />
                <PropertyRow
                    microformat={Microformat.PlainProp.P_Post_Office_Box}
                    displayName={_("hadr_post_office_box")}
                    displayValue={postOfficeBox}
                />
                <PropertyRow
                    microformat={Microformat.PlainProp.P_Street_Address}
                    displayName={_("hadr_street_address")}
                    displayValue={streetAddress}
                />
                <PropertyRow
                    microformat={Microformat.PlainProp.P_Extended_Address}
                    displayName={_("hadr_extended_address")}
                    displayValue={extendedAddress}
                />
                <PropertyRow
                    microformat={Microformat.PlainProp.P_Locality}
                    displayName={_("hadr_locality")}
                    displayValue={locality}
                />
                <PropertyRow
                    microformat={Microformat.PlainProp.P_Region}
                    displayName={_("hadr_region")}
                    displayValue={region}
                />
                <PropertyRow
                    microformat={Microformat.PlainProp.P_Country_Name}
                    displayName={_("hadr_country_name")}
                    displayValue={countryName}
                />
                <PropertyRow
                    microformat={Microformat.PlainProp.P_Postal_Code}
                    displayName={_("hadr_postal_code")}
                    displayValue={postalCode}
                />
                <PropertyRow
                    microformat={Microformat.PlainProp.P_Latitude}
                    displayName={_("hadr_latitude")}
                    displayValue={latitude}
                />
                <PropertyRow
                    microformat={Microformat.PlainProp.P_Longitude}
                    displayName={_("hadr_longitude")}
                    displayValue={longitude}
                />
                <PropertyRow
                    microformat={Microformat.PlainProp.P_Altitude}
                    displayName={_("hadr_altitude")}
                    displayValue={altitude}
                />
            </PropertiesTable>
        </>
    );
};

function addressSummary(location: HAdrData): string | null {
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
}

function LinkToMap(props: HTMLProps<HTMLAnchorElement>) {
    const { href, className, ...rest } = props;
    if (!href) return null;

    return (
        <LinkTo href={href} className="maps" {...rest}>
            <Icon icon={Icons.Map} /> Open in Google Maps
        </LinkTo>
    );
}

const getMapsUrl = (location: HAdrData): string | undefined => {
    const query = (
        formatLatLong(location.latitude, location.longitude) ??
        addressSummary(location)
    )?.replace(/\s+/g, "+");

    if (!query) return undefined;

    return `https://www.google.com/maps/search/${query}`;
};
