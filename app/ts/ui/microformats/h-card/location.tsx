import React, { HTMLProps } from "react";
import { _ } from "ts/compat";
import { Microformat, Microformats } from "ts/data/microformats";
import {
    HAdrData,
    HGeoData,
    isHAdrData,
    isHCardData,
    isHGeoData,
    isString,
} from "ts/data/types";
import { formatLatLong } from "ts/ui/formatting";
import { Icon, Icons } from "ts/ui/icon";
import { LinkTo } from "ts/ui/link-to";
import {
    displayValueProperties,
    PropertiesTable,
    PropertyRow,
} from "ts/ui/microformats/common/properties";
import { PropsOf } from "ts/ui/props";
import { LocationData } from "ts/data/types/h-adr";

export const LocationSummary = (props: {
    microformat: Microformats;
    locations: LocationData[] | null;
}) => {
    return (
        <PropertyRow
            microformat={props.microformat}
            icon={Icons.Location}
            values={props.locations?.map(it => ({
                displayValue: addressSummary(it),
                onClick: getMapsUrl(it),
            }))}
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
                    values={displayValueProperties(label)}
                />
                <PropertyRow
                    microformat={Microformat.P.Post_Office_Box}
                    property={{ displayName: _("hadr_post_office_box") }}
                    values={displayValueProperties(postOfficeBox)}
                />
                <PropertyRow
                    microformat={Microformat.P.Street_Address}
                    property={{ displayName: _("hadr_street_address") }}
                    values={displayValueProperties(streetAddress)}
                />
                <PropertyRow
                    microformat={Microformat.P.Extended_Address}
                    property={{ displayName: _("hadr_extended_address") }}
                    values={displayValueProperties(extendedAddress)}
                />
                <PropertyRow
                    microformat={Microformat.P.Locality}
                    property={{ displayName: _("hadr_locality") }}
                    values={displayValueProperties(locality)}
                />
                <PropertyRow
                    microformat={Microformat.P.Region}
                    property={{ displayName: _("hadr_region") }}
                    values={displayValueProperties(region)}
                />
                <PropertyRow
                    microformat={Microformat.P.Country_Name}
                    property={{ displayName: _("hadr_country_name") }}
                    values={displayValueProperties(countryName)}
                />
                <PropertyRow
                    microformat={Microformat.P.Postal_Code}
                    property={{ displayName: _("hadr_postal_code") }}
                    values={displayValueProperties(postalCode)}
                />
                <PropertyRow
                    microformat={Microformat.P.Latitude}
                    property={{ displayName: _("hadr_latitude") }}
                    values={{ displayValue: latitude }}
                />
                <PropertyRow
                    microformat={Microformat.P.Longitude}
                    property={{ displayName: _("hadr_longitude") }}
                    values={{ displayValue: longitude }}
                />
                <PropertyRow
                    microformat={Microformat.P.Altitude}
                    property={{ displayName: _("hadr_altitude") }}
                    values={{ displayValue: altitude }}
                />
            </PropertiesTable>
        </>
    );
};

const addressSummary = (location: LocationData): string | null => {
    if (typeof location === "string") return location;
    if (isHAdrData(location)) return summaryFromHAddr(location);
    if (isHGeoData(location)) return summaryFromHGeo(location);

    console.warn(
        `Unhandled source for addressSummary: ${JSON.stringify(location)}`,
    );

    return null;
};

const summaryFromHAddr = (location: HAdrData): string | null => {
    const { countryName, locality, region, latitude, longitude } = location;

    return (
        [locality?.[0], region?.[0], countryName?.[0]]
            .nullIfEmpty()
            ?.join(", ") ?? summaryFromHGeo(location)
    );
};
const summaryFromHGeo = (location: HGeoData): string | null =>
    formatLatLong(location.latitude, location.longitude);

const LinkToMap = (props: HTMLProps<HTMLAnchorElement>) => {
    const { href, className, ...rest } = props;
    if (!href) return null;

    return (
        <LinkTo href={href} className="maps" {...rest}>
            <Icon icon={Icons.Map} /> Open in Google Maps
        </LinkTo>
    );
};

const getMapsUrl = (location: LocationData | null): string | undefined => {
    if (!location) return undefined;
    let query: string | undefined = undefined;
    if (isString(location)) {
        query = location;
    }
    if (isHGeoData(location)) {
        query = (
            formatLatLong(location.latitude, location.longitude) ??
            addressSummary(location)
        )?.replace(/\s+/g, "+");
    }
    if (isHCardData(location)) {
        return getMapsUrl(location.location?.[0] ?? null);
    }

    if (!query) return undefined;

    return `https://www.google.com/maps/search/${query}`;
};
