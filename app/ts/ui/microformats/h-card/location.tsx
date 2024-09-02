import React, { useContext } from "react";
import { _ } from "ts/compat";
import { Microformat } from "ts/data/microformats";
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
    CustomPropertyRow,
    PropertyRow,
} from "ts/ui/microformats/common/properties";
import { PropsOf } from "ts/ui/props";
import { LocationData } from "ts/data/types/h-adr";
import { MapsProvider, OptionsContext } from "ts/options";
import { IconWithText } from "ts/ui/icon/icons";
import { Row, Space } from "ts/ui/layout";

export const LocationSummary = (props: {
    microformat: Microformat;
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
        geo,
        value,
    } = props.data;

    return (
        <PropertiesTable>
            <LinkToMap {...props.data} />

            <PropertyRow
                microformat={Microformat.P.Label}
                property={{ displayName: _("hadr_label") }}
                values={displayValueProperties(label)}
            />
            <PropertyRow
                microformat={Microformat.P.PostOfficeBox}
                property={{ displayName: _("hadr_post_office_box") }}
                values={displayValueProperties(postOfficeBox)}
            />
            <PropertyRow
                microformat={Microformat.P.StreetAddress}
                property={{ displayName: _("hadr_street_address") }}
                values={displayValueProperties(streetAddress)}
            />
            <PropertyRow
                microformat={Microformat.P.ExtendedAddress}
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
                microformat={Microformat.P.CountryName}
                property={{ displayName: _("hadr_country_name") }}
                values={displayValueProperties(countryName)}
            />
            <PropertyRow
                microformat={Microformat.P.PostalCode}
                property={{ displayName: _("hadr_postal_code") }}
                values={displayValueProperties(postalCode)}
            />
            {geo?.map((it, index) => <Geo geo={it} key={`geo_${index}`} />)}
        </PropertiesTable>
    );
};

const Geo = (props: { geo: HGeoData | string }) => {
    const { geo } = props;
    if (isString(geo)) {
        return (
            <PropertyRow
                microformat={Microformat.P.Geo}
                hrefMicroformat={Microformat.U.Geo}
                property={{ displayName: _("hgeo") }}
                values={displayValueProperties([geo])}
            />
        );
    }

    return (
        <CustomPropertyRow
            microformat={Microformat.H.Geo}
            property={{ displayName: _("hgeo") }}
        >
            <Row space={Space.Char}>
                <PropertyRow
                    microformat={Microformat.P.Latitude}
                    values={displayValueProperties(
                        [geo.latitude].nullIfEmpty(),
                    )}
                />
                <PropertyRow
                    microformat={Microformat.P.Longitude}
                    values={displayValueProperties(
                        [geo.longitude].nullIfEmpty(),
                    )}
                />
                <PropertyRow
                    microformat={Microformat.P.Altitude}
                    values={displayValueProperties(
                        [geo.altitude].nullIfEmpty(),
                    )}
                />
            </Row>
        </CustomPropertyRow>
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
    const { countryName, locality, region } = location;

    return (
        [locality?.[0], region?.[0], countryName?.[0]]
            .nullIfEmpty()
            ?.join(", ") ?? null
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
    let query: string | null | undefined = undefined;
    if (isString(location)) {
        query = location;
    } else if (isHGeoData(location)) {
        query = formatLatLong(location.latitude, location.longitude);
    } else if (isHAdrData(location)) {
        const geo = location.geo?.[0];
        if (geo) {
            return getMapsUrl(geo, provider);
        }
    } else if (isHCardData(location)) {
        return getMapsUrl(location.location?.[0] ?? null, provider);
    }

    if (!query) {
        query = addressSummary(location);
    }

    if (!query) return undefined;

    return provider.search.replace("{query}", encodeURIComponent(query));
};

export const _private = {
    getMapsUrl: getMapsUrl,
};
