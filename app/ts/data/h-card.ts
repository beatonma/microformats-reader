import {
    Image,
    MicroformatProperties,
    ParsedDocument,
} from "microformats-parser/dist/types";
import { HGeo } from "./h-geo";

interface HCardNameDetail {
    honorificPrefix?: string;
    honorificSuffix?: string;
    givenName?: string;
    additionalName?: string;
    familyName?: string;
    sortBy?: string;
    nickname?: string;
}

interface HAdr extends HGeo {
    locality?: string;
    region?: string;
    countryName?: string;
    postalCode?: string;
    streetAddress?: string;
    extendedAddress?: string;
    postOfficeBox?: string;
    label?: string;
    geo?: string;
    value?: string;
}

export interface HCardData {
    photo?: Image;
    logo?: Image;
    name?: string;
    nameDetail?: HCardNameDetail;
    url?: string;
    email?: string;
    birthday?: string;
    location: HAdr;
    category?: string;
}

const valueOf = (obj: any, key: string): string | null => {
    if (!obj) return null;

    let resolvedObj: any;
    if (obj.hasOwnProperty(key)) {
        resolvedObj = obj[key];
    } else if (obj.hasOwnProperty("properties"))
        resolvedObj = obj["properties"][key];
    else {
        return null;
    }

    if (resolvedObj == null) return null;

    let value: string;
    if (typeof resolvedObj === "string") value = resolvedObj;
    else if (Array.isArray(resolvedObj)) value = resolvedObj[0];
    else value = resolvedObj.toString();

    return value?.replace(/[\s\n ]+/gm, " ");
};

const parseLocation = (hcard: MicroformatProperties): HAdr | null => {
    const parseLocation = (obj?: any): HAdr | null => {
        if (obj == null) return null;

        if (typeof obj === "string") {
            return {
                value: obj,
            };
        }

        const result: HAdr = {
            locality: valueOf(obj, "locality"),
            region: valueOf(obj, "region"),
            countryName: valueOf(obj, "country-name"),
            postalCode: valueOf(obj, "postal-code"),
            streetAddress: valueOf(obj, "street-address"),
            extendedAddress: valueOf(obj, "extended-address"),
            postOfficeBox: valueOf(obj, "post-office-box"),
            label: valueOf(obj, "label"),
            geo: valueOf(obj, "geo"),
            latitude: valueOf(obj, "latitude"),
            longitude: valueOf(obj, "longitude"),
            altitude: valueOf(obj, "altitude"),
            value: valueOf(obj, "value"),
        };

        // Return HAdr if at least one field is populated, otherwise null.
        const accepted = Object.values(result).find(it => !!it) != null;
        console.log(`${accepted} result: ${JSON.stringify(result, null, 2)}`);
        return accepted ? result : null;
    };

    return parseLocation(hcard) ?? parseLocation(hcard.adr?.[0]) ?? null;
};

const parseImage = (items: Image[]): Image | null => items?.find(() => true);

const parseNameDetails = (hcard: MicroformatProperties): HCardNameDetail => ({
    honorificPrefix: valueOf(hcard, "honorific-prefix"),
    honorificSuffix: valueOf(hcard, "honorific-suffix"),
    givenName: valueOf(hcard, "given-name"),
    additionalName: valueOf(hcard, "additional-name"),
    familyName: valueOf(hcard, "family-name"),
    sortBy: valueOf(hcard, "nickname"),
    nickname: valueOf(hcard, "nickname"),
});

export const parseHCards = (microformats: ParsedDocument): HCardData[] => {
    const hcards: MicroformatProperties[] = microformats.items
        .filter(item => item.type.includes("h-card"))
        .map(item => item.properties);

    return hcards.map(hcard => ({
        name: valueOf(hcard, "name"),
        nameDetail: parseNameDetails(hcard),
        url: valueOf(hcard, "url"),
        birthday: valueOf(hcard, "bday"),
        location: parseLocation(hcard),
        photo: parseImage((hcard.photo as Image[]) ?? []),
        logo: parseImage((hcard.logo as Image[]) ?? []),
    }));
};
