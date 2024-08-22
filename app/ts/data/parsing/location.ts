import { MicroformatProperties, MicroformatRoot } from "@microformats-parser";
import { HAdrData, isString } from "ts/data/types";
import { nullable } from "ts/data/util/object";
import { Parse } from "ts/data/parsing/parse";
import { Microformat, Microformats } from "ts/data/microformats";

/**
 * @param obj representing an `h-adr` or `h-geo` parsed object.
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
            latitude: null,
            longitude: null,
            altitude: null,
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
        geo: Parse.get<string>(properties, Microformat.H.Geo),
        latitude: Parse.single<string>(properties, Microformat.P.Latitude),
        longitude: Parse.single<string>(properties, Microformat.P.Longitude),
        altitude: Parse.single<string>(properties, Microformat.P.Altitude),
        value:
            obj.type?.includes(Microformat.H.Adr) ||
            obj.type?.includes(Microformat.H.Geo)
                ? Parse.single<string>(properties, Microformat.P.Name)
                : null,
    });
};

export const parseLocationFromProperties = (
    props: MicroformatProperties,
    keys: Microformats[],
): HAdrData[] | null => {
    return keys
        .map(key =>
            Parse.get<MicroformatRoot | string>(props, key)?.map(parseLocation),
        )
        .flat()
        .nullIfEmpty();
};
