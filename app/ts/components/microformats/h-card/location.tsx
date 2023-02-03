import React, { HTMLProps } from "react";
import { _ } from "ts/compat";
import { ExternalLink } from "ts/components/external-link";
import { Icon, Icons } from "ts/components/icons";
import { Dropdown } from "ts/components/layout/dropdown";
import { InlineGroup } from "ts/components/layout/inline-group";
import {
    PropertiesTable,
    PropertyRow,
    PropertySpan,
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
            <PropertySpan
                icon={Icons.Location}
                cls={_("location")}
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
    );

    // const summary = addressSummary(props);
    //
    // return (
    //     <Dropdown header={summary} headerClassName="h-adr">
    //         <LinkToMap href={getMapsUrl(summary)} />
    //         <PropertiesTable>
    //             <PropertyRow
    //                 cls={Microformats.P_Label}
    //                 name={_("hadr_label")}
    //                 value={label}
    //             />
    //             <PropertyRow
    //                 cls={Microformats.P_Post_Office_Box}
    //                 name={_("hadr_post_office_box")}
    //                 value={postOfficeBox}
    //             />
    //             <PropertyRow
    //                 cls={Microformats.P_Street_Address}
    //                 name={_("hadr_street_address")}
    //                 value={streetAddress}
    //             />
    //             <PropertyRow
    //                 cls={Microformats.P_Extended_Address}
    //                 name={_("hadr_extended_address")}
    //                 value={extendedAddress}
    //             />
    //             <PropertyRow
    //                 cls={Microformats.P_Locality}
    //                 name={_("hadr_locality")}
    //                 value={locality}
    //             />
    //             <PropertyRow
    //                 cls={Microformats.P_Region}
    //                 name={_("hadr_region")}
    //                 value={region}
    //             />
    //             <PropertyRow
    //                 cls={Microformats.P_Country_Name}
    //                 name={_("hadr_country_name")}
    //                 value={countryName}
    //             />
    //             <PropertyRow
    //                 cls={Microformats.P_Postal_Code}
    //                 name={_("hadr_postal_code")}
    //                 value={postalCode}
    //             />
    //             <PropertyRow
    //                 cls={Microformats.P_Latitude}
    //                 name={_("hadr_latitude")}
    //                 value={latitude}
    //             />
    //             <PropertyRow
    //                 cls={Microformats.P_Longitude}
    //                 name={_("hadr_longitude")}
    //                 value={longitude}
    //             />
    //             <PropertyRow
    //                 cls={Microformats.P_Altitude}
    //                 name={_("hadr_altitude")}
    //                 value={altitude}
    //             />
    //         </PropertiesTable>
    //     </Dropdown>
    // );
};

function addressSummary(location: HAdr): string {
    const { countryName, locality, region, latitude, longitude } = location;

    let fields: string[] = [locality, region, countryName].filter(Boolean);
    if (fields) {
        return fields.join(", ");
    }

    const latLong = formatLatLong(latitude, longitude);
    if (latLong) {
        return latLong;
    }

    return null;
}

function LinkToMap(props: HTMLProps<HTMLAnchorElement>) {
    const { href, className, ...rest } = props;
    return (
        <ExternalLink href={href} className="maps" {...rest}>
            <Icon icon={Icons.Map} /> Open in Google Maps
        </ExternalLink>
    );
}

/**
 * @param  {string} query A description of a place or address
 * @return {string} A formatted link for a Google Maps search
 */
const getMapsUrl = (query: string) =>
    "https://www.google.com/maps/search/" + query.replace(/[\s]+/g, "+");
