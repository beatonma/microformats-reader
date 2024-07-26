import { MicroformatProperties, MicroformatRoot } from "@microformats-parser";
import { HAdrData, isString } from "ts/data/types";
import { nullable } from "ts/data/util/object";
import { Parse } from "ts/data/parsing/parse";
import { Microformat } from "ts/data/microformats";

export const parseLocation = (obj: MicroformatProperties) => {
    const nested =
        ((obj.addr ?? obj.adr)?.[0] as string | MicroformatRoot) ?? null;
    if (isString(nested)) {
        return _parseLocation(nested);
    }
    return _parseLocation(nested?.properties) ?? _parseLocation(obj);
};

const _parseLocation = (
    obj: MicroformatProperties | string | null,
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

    return nullable({
        locality: Parse.get<string>(obj, Microformat.P.Locality),
        region: Parse.get<string>(obj, Microformat.P.Region),
        countryName: Parse.get<string>(obj, Microformat.P.Country_Name),
        postalCode: Parse.get<string>(obj, Microformat.P.Postal_Code),
        streetAddress: Parse.get<string>(obj, Microformat.P.Street_Address),
        extendedAddress: Parse.get<string>(obj, Microformat.P.Extended_Address),
        postOfficeBox: Parse.get<string>(obj, Microformat.P.Post_Office_Box),
        label: Parse.get<string>(obj, Microformat.P.Label),
        geo: Parse.get<string>(obj, Microformat.H.Geo),
        latitude: Parse.first<string>(obj, Microformat.P.Latitude),
        longitude: Parse.first<string>(obj, Microformat.P.Longitude),
        altitude: Parse.first<string>(obj, Microformat.P.Altitude),
        value: null,
    });
};
