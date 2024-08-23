import React, { useContext } from "react";
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
import { Icons } from "ts/ui/icon";
import { LinkTo } from "ts/ui/link-to";
import {
    displayValueProperties,
    PropertiesTable,
    PropertyRow,
} from "ts/ui/microformats/common/properties";
import { PropsOf } from "ts/ui/props";
import { LocationData } from "ts/data/types/h-adr";
import { MapsProvider, OptionsContext } from "ts/options";
import { IconWithText } from "ts/ui/icon/icons";

export const LocationSummary = (props: {
    microformat: Microformats;
    locations: LocationData[] | null;
}) => {
    const options = useContext(OptionsContext);

    return (
        <PropertyRow
            microformat={props.microformat}
            icon={Icons.Location}
            values={props.locations?.map(it => ({
                displayValue: addressSummary(it),
                onClick: getMapsUrl(it, options.mapsProvider),
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
                <LinkToMap {...props.data} />

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

const LinkToMap = (props: HAdrData) => {
    const options = useContext(OptionsContext);
    const mapsProvider = options.mapsProvider;
    const url = getMapsUrl(props, mapsProvider);

    if (!url) return null;

    return (
        <LinkTo href={url} className="maps">
            <IconWithText
                icon={Icons.Map}
                text={`Open in ${mapsProvider.uiName}`}
            />
        </LinkTo>
    );
};

const getMapsUrl = (
    location: LocationData | null,
    provider: MapsProvider,
): string | undefined => {
    if (!location) return undefined;
    let query: string | undefined = undefined;
    if (isString(location)) {
        query = location;
    } else if (isHGeoData(location)) {
        query =
            formatLatLong(location.latitude, location.longitude) ??
            addressSummary(location) ??
            undefined;
    } else if (isHCardData(location)) {
        return getMapsUrl(location.location?.[0] ?? null, provider);
    }

    if (!query) return undefined;

    return provider.search.replace("{query}", encodeURIComponent(query));
};

export const _private = {
    getMapsUrl: getMapsUrl,
};
