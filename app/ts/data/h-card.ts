import {Image, MicroformatProperties, ParsedDocument,} from "microformats-parser/dist/types";
import {noneOf, notNullish} from "ts/data/arrays";
import {Parse} from "ts/data/parsing";
import {HAdrData} from "ts/data/types";
import {
    HCardContactData,
    HCardData,
    HCardDates,
    HCardExtras,
    HCardGenderIdentity,
    HCardImages,
    HCardJobData,
    HCardNameDetail,
} from "ts/data/types/h-card";

/*
 * Structures.
 */

/*
 * Parsing.
 */

export const parseHCards = async (
    microformats: ParsedDocument
): Promise<HCardData[]> =>
    new Promise((resolve, reject) => {
        const items: MicroformatProperties[] = microformats.items
            .filter(item => item.type?.includes("h-card"))
            .map(item => item.properties);

        const primaryHcards = items.map(parseHCard).filter(notNullish);
        const hcards: HCardData[] = [];
        primaryHcards.forEach((hcard, index) => {
            hcards.push(hcard);
            if (hcard.job?.orgHCard != null) hcards.push(hcard.job.orgHCard);
        });

        resolve(hcards);
    });

const parseHCard = (hcard: MicroformatProperties): HCardData | null => {
    if (hcard == null) return null;

    const name = Parse.valueOf(hcard, "name");
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
    const photo = Parse.parseFirst(hcard, "photo") as Image;
    const logo = Parse.parseFirst(hcard, "logo") as Image;

    if (noneOf([photo, logo])) return null;
    return {
        photo: photo,
        logo: logo,
    };
};

const parseLocation = (hcard: MicroformatProperties): HAdrData | null => {
    const parseLocation = (obj?: any): HAdrData | null => {
        if (obj == null) return null;

        if (typeof obj === "string") {
            return {
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
                value: obj,
            };
        }

        const result: HAdrData = {
            locality: Parse.valueOf(obj, "locality"),
            region: Parse.valueOf(obj, "region"),
            countryName: Parse.valueOf(obj, "country-name"),
            postalCode: Parse.valueOf(obj, "postal-code"),
            streetAddress: Parse.valueOf(obj, "street-address"),
            extendedAddress: Parse.valueOf(obj, "extended-address"),
            postOfficeBox: Parse.valueOf(obj, "post-office-box"),
            label: Parse.valueOf(obj, "label"),
            geo: Parse.valueOf(obj, "geo"),
            latitude: Parse.valueOf(obj, "latitude"),
            longitude: Parse.valueOf(obj, "longitude"),
            altitude: Parse.valueOf(obj, "altitude"),
            value: Parse.valueOf(obj, "value"),
        };

        // Return HAdr if at least one field is populated, otherwise null.
        const accepted = Object.values(result).find(Boolean) != null;
        return accepted ? result : null;
    };

    return parseLocation(hcard.adr?.[0]) ?? parseLocation(hcard) ?? null;
};

const parseNameDetails = (
    hcard: MicroformatProperties
): HCardNameDetail | null => {
    const honorificPrefix = Parse.valueOf(hcard, "honorific-prefix");
    const honorificSuffix = Parse.valueOf(hcard, "honorific-suffix");
    const givenName = Parse.valueOf(hcard, "given-name");
    const additionalName = Parse.valueOf(hcard, "additional-name");
    const familyName = Parse.valueOf(hcard, "family-name");
    const sortBy = Parse.valueOf(hcard, "sort-string");
    const nickname = Parse.valueOf(hcard, "nickname");
    const sound = Parse.valueOf(hcard, "sound");

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
        honorificPrefix: Parse.valueOf(hcard, "honorific-prefix"),
        honorificSuffix: Parse.valueOf(hcard, "honorific-suffix"),
        givenName: Parse.valueOf(hcard, "given-name"),
        additionalName: Parse.valueOf(hcard, "additional-name"),
        familyName: Parse.valueOf(hcard, "family-name"),
        sortBy: Parse.valueOf(hcard, "sort-string"),
        nickname: Parse.valueOf(hcard, "nickname"),
        sound: Parse.valueOf(hcard, "sound"),
    };
};

/**
 * Not really standardised at time of writing, try to find any reasonable variant.
 * - https://microformats.org/wiki/pronouns-brainstorming
 * @param hcard
 */
const parsePronouns = (hcard: MicroformatProperties): string | null => {
    const pronouns =
        Parse.parseExperimental(hcard, "pronouns") ??
        Parse.parseExperimental(hcard, "pronoun");
    if (pronouns) return pronouns;

    const nominative = Parse.parseExperimental(hcard, "pronoun-nominative");
    const oblique = Parse.parseExperimental(hcard, "pronoun-oblique");
    const possessive = Parse.parseExperimental(hcard, "pronoun-possessive");

    return (
        [nominative, oblique, possessive].filter(notNullish).join(" | ") || null
    );
};

const parseGender = (
    hcard: MicroformatProperties
): HCardGenderIdentity | null => {
    const pronouns = parsePronouns(hcard);
    const genderIdentity = Parse.valueOf(hcard, "gender-identity");
    const sex = Parse.valueOf(hcard, "sex");

    if (noneOf([pronouns, genderIdentity, sex])) return null;
    return {
        pronouns: pronouns,
        genderIdentity: genderIdentity,
        sex: sex,
    };
};

const parseDates = (hcard: MicroformatProperties): HCardDates | null => {
    const birthday = Parse.valueOf(hcard, "bday");
    const anniversary = Parse.valueOf(hcard, "anniversary");

    if (!birthday && !anniversary) return null;
    return {
        birthday: birthday,
        anniversary: anniversary,
    };
};

const parseContact = (
    hcard: MicroformatProperties
): HCardContactData | null => {
    const url = Parse.valueOf(hcard, "url");
    const email = Parse.valueOf(hcard, "email");
    const phone = Parse.valueOf(hcard, "tel");
    const impp = Parse.valueOf(hcard, "impp");
    const key = Parse.valueOf(hcard, "key");

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
    const org = Parse.getObject(hcard, "org");

    let orgHCard: HCardData | null = null;
    if (Array.isArray(org)) {
        orgHCard = parseHCard(org[0]?.properties);
    }

    const jobTitle = Parse.valueOf(hcard, "job-title");
    const role = Parse.valueOf(hcard, "role");

    if (noneOf([org, jobTitle, role])) return null;

    return {
        orgName: orgHCard?.name ?? Parse.coerceToString(org),
        orgHCard: orgHCard,
        jobTitle: jobTitle,
        role: role,
    };
};

const parseExtras = (hcard: MicroformatProperties): HCardExtras | null => {
    const uid = Parse.valueOf(hcard, "uid");
    const notes = Parse.valueOf(hcard, "note");
    const category = Parse.valueOf(hcard, "category");

    if (noneOf([uid, notes, category])) return null;

    return {
        uid: uid,
        notes: notes,
        category: category,
    };
};
