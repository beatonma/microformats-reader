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
import { HAdr } from "ts/data/h-card";
import { Microformats } from "ts/data/microformats";
import { formatLatLong } from "ts/formatting";
import "./location.scss";

export const Location = (props: HAdr | null) => {
    if (props == null) return null;

    const summary = addressSummary(props);

    return (
        <InlineGroup className="location" title={_("location")}>
            <Property
                icon={Icons.Location}
                cls={_("hcard_location_detail")}
                value={summary}
            />
        </InlineGroup>
    );
};

export const LocationPropertiesTable = (props: HAdr | null) => {
    if (props == null) return null;
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
    } = props;

    return (
        <>
            <LinkToMap href={getMapsUrl(props)} />
            <PropertiesTable>
                <PropertyRow
                    cls={Microformats.P_Label}
                    name={_("hadr_label")}
                    value={label}
                />
                <PropertyRow
                    cls={Microformats.P_Post_Office_Box}
                    name={_("hadr_post_office_box")}
                    value={postOfficeBox}
                />
                <PropertyRow
                    cls={Microformats.P_Street_Address}
                    name={_("hadr_street_address")}
                    value={streetAddress}
                />
                <PropertyRow
                    cls={Microformats.P_Extended_Address}
                    name={_("hadr_extended_address")}
                    value={extendedAddress}
                />
                <PropertyRow
                    cls={Microformats.P_Locality}
                    name={_("hadr_locality")}
                    value={locality}
                />
                <PropertyRow
                    cls={Microformats.P_Region}
                    name={_("hadr_region")}
                    value={region}
                />
                <PropertyRow
                    cls={Microformats.P_Country_Name}
                    name={_("hadr_country_name")}
                    value={countryName}
                />
                <PropertyRow
                    cls={Microformats.P_Postal_Code}
                    name={_("hadr_postal_code")}
                    value={postalCode}
                />
                <PropertyRow
                    cls={Microformats.P_Latitude}
                    name={_("hadr_latitude")}
                    value={latitude}
                />
                <PropertyRow
                    cls={Microformats.P_Longitude}
                    name={_("hadr_longitude")}
                    value={longitude}
                />
                <PropertyRow
                    cls={Microformats.P_Altitude}
                    name={_("hadr_altitude")}
                    value={altitude}
                />
            </PropertiesTable>
        </>
    );
};

function addressSummary(location: HAdr): string {
    const { countryName, locality, region, latitude, longitude } = location;

    let fields: string[] = [locality, region, countryName].filter(Boolean);
    if (fields) {
        return fields.join(", ");
    }

    return formatLatLong(latitude, longitude) ?? null;
}

function LinkToMap(props: HTMLProps<HTMLAnchorElement>) {
    const { href, className, ...rest } = props;
    return (
        <LinkTo href={href} className="maps" {...rest}>
            <Icon icon={Icons.Map} /> Open in Google Maps
        </LinkTo>
    );
}

const getMapsUrl = (location: HAdr) => {
    const query = (
        formatLatLong(location.latitude, location.longitude) ??
        addressSummary(location)
    ).replace(/\s+/g, "+");

    return `https://www.google.com/maps/search/${query}`;
};
