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
            displayValue={summary}
        />
    );
};

export const LocationPropertiesTable = (
    props: PropsOf<HAdrData> & PropertiesTable.TableProps,
) => {
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
            <PropertiesTable.Table inlineTableData={props.inlineTableData}>
                <PropertiesTable.FullspanRow>
                    <LinkToMap href={getMapsUrl(props.data)} />
                </PropertiesTable.FullspanRow>

                <PropertiesTable.PropertyRow
                    microformat={Microformat.P.Label}
                    displayName={_("hadr_label")}
                    displayValue={label}
                />
                <PropertiesTable.PropertyRow
                    microformat={Microformat.P.Post_Office_Box}
                    displayName={_("hadr_post_office_box")}
                    displayValue={postOfficeBox}
                />
                <PropertiesTable.PropertyRow
                    microformat={Microformat.P.Street_Address}
                    displayName={_("hadr_street_address")}
                    displayValue={streetAddress}
                />
                <PropertiesTable.PropertyRow
                    microformat={Microformat.P.Extended_Address}
                    displayName={_("hadr_extended_address")}
                    displayValue={extendedAddress}
                />
                <PropertiesTable.PropertyRow
                    microformat={Microformat.P.Locality}
                    displayName={_("hadr_locality")}
                    displayValue={locality}
                />
                <PropertiesTable.PropertyRow
                    microformat={Microformat.P.Region}
                    displayName={_("hadr_region")}
                    displayValue={region}
                />
                <PropertiesTable.PropertyRow
                    microformat={Microformat.P.Country_Name}
                    displayName={_("hadr_country_name")}
                    displayValue={countryName}
                />
                <PropertiesTable.PropertyRow
                    microformat={Microformat.P.Postal_Code}
                    displayName={_("hadr_postal_code")}
                    displayValue={postalCode}
                />
                <PropertiesTable.PropertyRow
                    microformat={Microformat.P.Latitude}
                    displayName={_("hadr_latitude")}
                    displayValue={latitude}
                />
                <PropertiesTable.PropertyRow
                    microformat={Microformat.P.Longitude}
                    displayName={_("hadr_longitude")}
                    displayValue={longitude}
                />
                <PropertiesTable.PropertyRow
                    microformat={Microformat.P.Altitude}
                    displayName={_("hadr_altitude")}
                    displayValue={altitude}
                />
            </PropertiesTable.Table>
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
