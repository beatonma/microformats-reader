import {
    Image,
    MicroformatProperties,
    ParsedDocument,
} from "microformats-parser/dist/types";
import { noneOf } from "ts/data/arrays";

/*
 * Structures.
 */

export interface HCardData {
    name?: string;
    nameDetail?: HCardNameDetail;
    images?: Images;
    gender?: GenderIdentity;
    contact?: ContactData;
    location: HAdr;
    job?: JobData;
    dates?: Dates;
    uid?: string;
    category?: string;
    notes?: string;
}

export interface HCardNameDetail {
    honorificPrefix?: string;
    honorificSuffix?: string;
    givenName?: string;
    additionalName?: string;
    familyName?: string;
    sortBy?: string;
    nickname?: string;
    sound?: string;
}

export interface HGeo {
    latitude?: string;
    longitude?: string;
    altitude?: string;
}

export interface HAdr extends HGeo {
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

export interface Images {
    photo?: Image;
    logo?: Image;
}

export interface GenderIdentity {
    sex?: string;
    genderIdentity?: string;
    pronouns?: string;
}

export interface ContactData {
    url?: string;
    email?: string;
    phone?: string;
    impp?: string;
    key?: string;
}

export interface JobData {
    org?: string | HCardData;
    jobTitle?: string;
    role?: string;
}

export interface Dates {
    birthday?: string;
    anniversary?: string;
}

/*
 * Parsing.
 */

export const parseHCards = (microformats: ParsedDocument): HCardData[] => {
    const hcards: MicroformatProperties[] = microformats.items
        .filter(item => item.type.includes("h-card"))
        .map(item => item.properties);

    return hcards.map(hcard => ({
        name: valueOf(hcard, "name"),
        nameDetail: parseNameDetails(hcard),
        gender: parseGender(hcard),
        location: parseLocation(hcard),
        contact: parseContact(hcard),
        job: parseJob(hcard),
        dates: parseDates(hcard),
        images: parseImages(hcard),
    }));
};

const parseImages = (hcard: MicroformatProperties): Images | null => {
    const photo = parseImage((hcard.photo as Image[]) ?? []);
    const logo = parseImage((hcard.logo as Image[]) ?? []);

    if (noneOf([photo, logo])) return null;
    return {
        photo: photo,
        logo: logo,
    };
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
        return accepted ? result : null;
    };

    return parseLocation(hcard.adr?.[0]) ?? parseLocation(hcard) ?? null;
};

const parseImage = (items: Image[]): Image | null => items?.find(() => true);

const parseNameDetails = (hcard: MicroformatProperties): HCardNameDetail => ({
    honorificPrefix: valueOf(hcard, "honorific-prefix"),
    honorificSuffix: valueOf(hcard, "honorific-suffix"),
    givenName: valueOf(hcard, "given-name"),
    additionalName: valueOf(hcard, "additional-name"),
    familyName: valueOf(hcard, "family-name"),
    sortBy: valueOf(hcard, "sort-string"),
    nickname: valueOf(hcard, "nickname"),
    sound: valueOf(hcard, "sound"),
});

/**
 * Not really standardised at time of writing, try to find any reasonable variant.
 * - https://microformats.org/wiki/pronouns-brainstorming
 * @param hcard
 */
const parsePronouns = (hcard: MicroformatProperties): string | null => {
    const pronouns =
        parseExperimental(hcard, "pronouns") ??
        parseExperimental(hcard, "pronoun");
    if (pronouns) return pronouns;

    const nominative = parseExperimental(hcard, "pronoun-nominative");
    const oblique = parseExperimental(hcard, "pronoun-oblique");
    const possessive = parseExperimental(hcard, "pronoun-possessive");

    return (
        [nominative, oblique, possessive].filter(Boolean).join(" | ") || null
    );
};

const parseGender = (hcard: MicroformatProperties): GenderIdentity | null => {
    const pronouns = parsePronouns(hcard);
    const genderIdentity = valueOf(hcard, "gender-identity");
    const sex = valueOf(hcard, "sex");

    if (noneOf([pronouns, genderIdentity, sex])) return null;
    return {
        pronouns: pronouns,
        genderIdentity: genderIdentity,
        sex: sex,
    };
};

const parseDates = (hcard: MicroformatProperties): Dates | null => {
    const birthday = valueOf(hcard, "bday");
    const anniversary = valueOf(hcard, "anniversary");

    if (!birthday && !anniversary) return null;
    return {
        birthday: birthday,
        anniversary: anniversary,
    };
};

const parseContact = (hcard: MicroformatProperties): ContactData | null => {
    const url = valueOf(hcard, "url");
    const email = valueOf(hcard, "email");
    const phone = valueOf(hcard, "tel");
    const impp = valueOf(hcard, "impp");
    const key = valueOf(hcard, "key");

    if (noneOf([url, email, phone, impp, key])) return null;

    return {
        url: url,
        email: email,
        phone: phone,
        impp: impp,
        key: key,
    };
};

const parseJob = (hcard: MicroformatProperties): JobData | null => {
    const org: string | HCardData = null; // TODO
    const jobTitle = valueOf(hcard, "job-title");
    const role = valueOf(hcard, "role");

    if (noneOf([org, jobTitle, role])) return null;

    return {
        org: org,
        jobTitle: jobTitle,
        role: role,
    };
};

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

/**
 * Try to read 'key' or 'x-key' values for non-standardised properties.
 */
const parseExperimental = (hcard: MicroformatProperties, key: string) =>
    valueOf(hcard, key) ?? valueOf(hcard, `x-${key}`);
