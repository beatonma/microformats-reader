import { MicroformatProperties, MicroformatRoot } from "@microformats-parser";
import { HAdrData, HGeoData, isString } from "ts/data/types";
import { nullable } from "ts/data/util/object";
import { Parse } from "ts/data/parsing/parse";
import { Microformat } from "ts/data/microformats";
import { parseEmbeddedHCards } from "ts/data/parsing/h-card";
import { LocationData } from "ts/data/types/h-adr";

/**
 * Parse contents of `p-location` which may have embedded `h-card`, `h-adr`,
 * `h-geo`, or just be a string.
 */
export const parsePLocation = (root: MicroformatRoot): LocationData[] | null =>
    parseLocationFromProperties(root.properties, [Microformat.P.Location]) ??
    parseLocationFromChildren(root.children) ??
    parseEmbeddedHCards(root.properties, Microformat.P.Location) ??
    null;

const parseLocationFromChildren = (
    children: MicroformatRoot[] | undefined,
): HAdrData[] | null =>
    Parse.getRootsOfType(children ?? [], Microformat.H.Adr)
        ?.map(parseLocation)
        ?.nullIfEmpty() ?? null;

/**
 * @param obj an `h-adr`, `h-geo`, or `h-card`.
 */
export const parseLocation = (
    obj: MicroformatRoot | string | null,
): HAdrData | null => {
    if (obj == null) return null;

    if (isString(obj)) {
        return {
            value: obj,
            locality: null,
            region: null,
            countryName: null,
            postalCode: null,
            streetAddress: null,
            extendedAddress: null,
            postOfficeBox: null,
            label: null,
            geo: null,
        };
    }

    const properties = obj.properties;

    return nullable({
        locality: Parse.get<string>(properties, Microformat.P.Locality),
        region: Parse.get<string>(properties, Microformat.P.Region),
        countryName: Parse.get<string>(properties, Microformat.P.Country_Name),
        postalCode: Parse.get<string>(properties, Microformat.P.Postal_Code),
        streetAddress: Parse.get<string>(
            properties,
            Microformat.P.Street_Address,
        ),
        extendedAddress: Parse.get<string>(
            properties,
            Microformat.P.Extended_Address,
        ),
        postOfficeBox: Parse.get<string>(
            properties,
            Microformat.P.Post_Office_Box,
        ),
        label: Parse.get<string>(properties, Microformat.P.Label),
        geo: parseGeo(properties),
        value:
            obj.type?.includes(Microformat.H.Adr) ||
            obj.type?.includes(Microformat.H.Geo)
                ? Parse.single<string>(properties, Microformat.P.Name)
                : null,
    });
};

const parseGeo = (
    rootProperties: MicroformatProperties,
): (HGeoData | string)[] | null => {
    const _parse = (value: MicroformatProperties): HGeoData | null =>
        nullable({
            latitude: Parse.single(value, Microformat.P.Latitude),
            longitude: Parse.single(value, Microformat.P.Longitude),
            altitude: Parse.single(value, Microformat.P.Altitude),
        });

    const inlineGeo: HGeoData | null = _parse(rootProperties);
    const nestedGeo: HGeoData[] =
        Parse.get(rootProperties, Microformat.P.Geo)
            ?.map((it: string | MicroformatRoot) =>
                isString(it) ? it : _parse(it.properties),
            )
            .nullIfEmpty() ?? [];

    return [...nestedGeo, inlineGeo].nullIfEmpty();
};

export const parseLocationFromProperties = (
    properties: MicroformatProperties,
    keys: Microformat[],
): HAdrData[] | null => {
    return keys
        .map(key =>
            Parse.get<MicroformatRoot | string>(properties, key)?.map(
                parseLocation,
            ),
        )
        .flat()
        .nullIfEmpty();
};
