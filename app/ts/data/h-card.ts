import {
    Image,
    MicroformatProperties,
    ParsedDocument,
} from "microformats-parser/dist/types";
import { noneOf } from "ts/data/arrays";

/*
 * Structures.
 */

export interface Named {
    name?: string;
}

export interface HCardData extends Named {
    id?: any;
    name?: string;
    nameDetail?: HCardNameDetail;
    images?: HCardImages;
    gender?: HCardGenderIdentity;
    contact?: HCardContactData;
    location: HAdr;
    job?: HCardJobData;
    dates?: HCardDates;
    extras?: HCardExtras;
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

export interface HCardImages {
    photo?: Image;
    logo?: Image;
}

export interface HCardGenderIdentity {
    sex?: string;
    genderIdentity?: string;
    pronouns?: string;
}

export interface HCardContactData {
    url?: string;
    email?: string;
    phone?: string;
    impp?: string;
    publicKey?: string;
}

export interface HCardJobData {
    orgName?: string;
    orgHCard?: HCardData;
    jobTitle?: string;
    role?: string;
}

export interface HCardDates {
    birthday?: string;
    anniversary?: string;
}

export interface HCardExtras {
    uid?: string;
    category?: string;
    notes?: string;
}

/*
 * Parsing.
 */

export const parseHCards = (microformats: ParsedDocument): HCardData[] => {
    const items: MicroformatProperties[] = microformats.items
        .filter(item => item.type.includes("h-card"))
        .map(item => item.properties);

    const primaryHcards = items.map(parseHCard).filter(Boolean);
    const hcards: HCardData[] = [];
    primaryHcards.forEach((hcard, index) => {
        hcards.push(hcard);
        if (hcard.job?.orgHCard != null) hcards.push(hcard.job.orgHCard);
    });
    return hcards;
};

const parseHCard = (hcard: MicroformatProperties): HCardData | null => {
    if (hcard == null) return null;

    const name = valueOf(hcard, "name");
    const nameDetail = parseNameDetails(hcard);
    const gender = parseGender(hcard);
    const location = parseLocation(hcard);
    const contact = parseContact(hcard);
    const job = parseJob(hcard);
    const dates = parseDates(hcard);
    const images = parseImages(hcard);
    const extras = parseExtras(hcard);

    if (
        noneOf([
            name,
            nameDetail,
            gender,
            location,
            contact,
            job,
            dates,
            images,
        ])
    )
        return null;

    return {
        id: Math.random().toString().replace(".", ""),
        name: name,
        nameDetail: nameDetail,
        gender: gender,
        location: location,
        contact: contact,
        job: job,
        dates: dates,
        images: images,
        extras: extras,
    };
};

const parseImages = (hcard: MicroformatProperties): HCardImages | null => {
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
        const accepted = Object.values(result).find(Boolean) != null;
        return accepted ? result : null;
    };

    return parseLocation(hcard.adr?.[0]) ?? parseLocation(hcard) ?? null;
};

const parseImage = (items: Image[]): Image | null => items?.find(() => true);

const parseNameDetails = (
    hcard: MicroformatProperties
): HCardNameDetail | null => {
    const honorificPrefix = valueOf(hcard, "honorific-prefix");
    const honorificSuffix = valueOf(hcard, "honorific-suffix");
    const givenName = valueOf(hcard, "given-name");
    const additionalName = valueOf(hcard, "additional-name");
    const familyName = valueOf(hcard, "family-name");
    const sortBy = valueOf(hcard, "sort-string");
    const nickname = valueOf(hcard, "nickname");
    const sound = valueOf(hcard, "sound");

    if (
        noneOf([
            honorificPrefix,
            honorificSuffix,
            givenName,
            additionalName,
            familyName,
            sortBy,
            nickname,
            sound,
        ])
    )
        return null;

    return {
        honorificPrefix: valueOf(hcard, "honorific-prefix"),
        honorificSuffix: valueOf(hcard, "honorific-suffix"),
        givenName: valueOf(hcard, "given-name"),
        additionalName: valueOf(hcard, "additional-name"),
        familyName: valueOf(hcard, "family-name"),
        sortBy: valueOf(hcard, "sort-string"),
        nickname: valueOf(hcard, "nickname"),
        sound: valueOf(hcard, "sound"),
    };
};

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

const parseGender = (
    hcard: MicroformatProperties
): HCardGenderIdentity | null => {
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

const parseDates = (hcard: MicroformatProperties): HCardDates | null => {
    const birthday = valueOf(hcard, "bday");
    const anniversary = valueOf(hcard, "anniversary");

    if (!birthday && !anniversary) return null;
    return {
        birthday: birthday,
        anniversary: anniversary,
    };
};

const parseContact = (
    hcard: MicroformatProperties
): HCardContactData | null => {
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
        publicKey: key,
    };
};

const parseJob = (hcard: MicroformatProperties): HCardJobData | null => {
    const org = getObject(hcard, "org");

    let orgHCard: HCardData | null = null;
    if (org != null && typeof org !== "string") {
        orgHCard = parseHCard(org[0]?.properties);
    }

    const jobTitle = valueOf(hcard, "job-title");
    const role = valueOf(hcard, "role");

    if (noneOf([org, jobTitle, role])) return null;

    return {
        orgName: orgHCard?.name ?? coerceToString(org),
        orgHCard: orgHCard,
        jobTitle: jobTitle,
        role: role,
    };
};

const parseExtras = (hcard: MicroformatProperties): HCardExtras | null => {
    const uid = valueOf(hcard, "uid");
    const notes = valueOf(hcard, "note");
    const category = valueOf(hcard, "category");

    if (noneOf([uid, notes, category])) return null;

    return {
        uid: uid,
        notes: notes,
        category: category,
    };
};

const valueOf = (obj: any, key: string): string | null => {
    const resolvedObj = getObject(obj, key);
    return coerceToString(resolvedObj);
};

const coerceToString = (obj: any): string | null => {
    if (obj == null) return null;

    let value: string;
    if (typeof obj === "string") value = obj;
    else if (Array.isArray(obj)) value = coerceToString(obj[0]);
    else value = obj.toString();

    // Strip extraneous whitespace
    return value?.replace(/\s+/gm, " ");
};

const getObject = (obj: any, key: string): any | null => {
    if (!obj) return null;

    if (obj.hasOwnProperty(key)) {
        return obj[key];
    }
    if (obj.hasOwnProperty("properties")) {
        return obj["properties"][key];
    }

    return null;
};

/**
 * Try to read 'key' or 'x-key' values for non-standardised properties.
 */
const parseExperimental = (hcard: MicroformatProperties, key: string) =>
    valueOf(hcard, key) ?? valueOf(hcard, `x-${key}`);
