import {
    Image,
    MicroformatProperties,
    MicroformatProperty,
    MicroformatRoot,
    ParsedDocument,
} from "microformats-parser/dist/types";
import { isEmpty, noneOf, notNullish } from "ts/data/arrays";
import { Microformat } from "ts/data/microformats";
import { Parse } from "ts/data/parse";
import { HAdrData, isString } from "ts/data/types";
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
 * Parsing.
 */

export const parseHCards = async (
    microformats: ParsedDocument
): Promise<HCardData[] | null> =>
    new Promise((resolve, reject) => {
        const items = Parse.getRootsOfType(
            microformats,
            Microformat.Root.H_Card
        ).map(item => item.properties);

        const primaryHcards = items.map(parseHCard).filter(notNullish);
        if (isEmpty(primaryHcards)) {
            resolve(null);
            return;
        }

        const hcards: HCardData[] = [];
        primaryHcards.forEach((hcard, index) => {
            hcards.push(hcard);
            if (hcard.job?.orgHCard != null) hcards.push(hcard.job.orgHCard);
        });

        resolve(hcards);
    });

const parseHCard = (hcard: MicroformatProperties): HCardData | null => {
    if (hcard == null) return null;

    const name = Parse.first<string>(hcard, "name");
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
            extras,
        ])
    ) {
        return null;
    }

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
    const photo = Parse.firstImage(hcard, "photo");
    const logo = Parse.firstImage(hcard, "logo");

    if (noneOf([photo, logo])) return null;
    return {
        photo: photo,
        logo: logo,
    };
};

const parseLocation = (hcard: MicroformatProperties): HAdrData | null => {
    const _parseLocation = (
        obj?: MicroformatProperties | string | null
    ): HAdrData | null => {
        if (obj == null) return null;

        if (isString(obj)) {
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
            locality: Parse.get<string>(obj, "locality"),
            region: Parse.get<string>(obj, "region"),
            countryName: Parse.get<string>(obj, "country-name"),
            postalCode: Parse.get<string>(obj, "postal-code"),
            streetAddress: Parse.get<string>(obj, "street-address"),
            extendedAddress: Parse.get<string>(obj, "extended-address"),
            postOfficeBox: Parse.get<string>(obj, "post-office-box"),
            label: Parse.get<string>(obj, "label"),
            geo: Parse.get<string>(obj, "geo"),
            latitude: Parse.first<string>(obj, "latitude"),
            longitude: Parse.first<string>(obj, "longitude"),
            altitude: Parse.first<string>(obj, "altitude"),
            value: Parse.first<string>(obj, "value"),
        };

        // Return HAdr if at least one field is populated, otherwise null.
        const accepted = Object.values(result).find(notNullish) != null;
        return accepted ? result : null;
    };

    const nestedAdr = (hcard.adr?.[0] as string | MicroformatRoot) ?? null;
    if (isString(nestedAdr)) {
        return _parseLocation(nestedAdr);
    }
    return _parseLocation(nestedAdr?.properties) ?? _parseLocation(hcard);
};

const parseNameDetails = (
    hcard: MicroformatProperties
): HCardNameDetail | null => {
    const honorificPrefix = Parse.get<string>(hcard, "honorific-prefix");
    const honorificSuffix = Parse.get<string>(hcard, "honorific-suffix");
    const givenName = Parse.get<string>(hcard, "given-name");
    const additionalName = Parse.get<string>(hcard, "additional-name");
    const familyName = Parse.get<string>(hcard, "family-name");
    const sortBy = Parse.get<string>(hcard, "sort-string");
    const nickname = Parse.get<string>(hcard, "nickname");
    const sound = Parse.get<string>(hcard, "sound");

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
        honorificPrefix: Parse.get<string>(hcard, "honorific-prefix"),
        honorificSuffix: Parse.get<string>(hcard, "honorific-suffix"),
        givenName: Parse.get<string>(hcard, "given-name"),
        additionalName: Parse.get<string>(hcard, "additional-name"),
        familyName: Parse.get<string>(hcard, "family-name"),
        sortBy: Parse.get<string>(hcard, "sort-string"),
        nickname: Parse.get<string>(hcard, "nickname"),
        sound: Parse.get<string>(hcard, "sound"),
    };
};

/**
 * Not really standardised at time of writing, try to find any reasonable variant.
 * - https://microformats.org/wiki/pronouns-brainstorming
 * @param hcard
 */
const parsePronouns = (hcard: MicroformatProperties): string[] | null => {
    const pronouns =
        Parse.getExperimental<string>(hcard, "pronouns") ??
        Parse.getExperimental<string>(hcard, "pronoun");
    if (pronouns) return pronouns;

    const nominative =
        Parse.getExperimental<string>(hcard, "pronoun-nominative") ?? [];
    const oblique =
        Parse.getExperimental<string>(hcard, "pronoun-oblique") ?? [];
    const possessive =
        Parse.getExperimental<string>(hcard, "pronoun-possessive") ?? [];

    return Parse.takeIfNotEmpty([...nominative, ...oblique, ...possessive]);
};

const parseGender = (
    hcard: MicroformatProperties
): HCardGenderIdentity | null => {
    const pronouns = parsePronouns(hcard);
    const genderIdentity = Parse.get<string>(hcard, "gender-identity");
    const sex = Parse.get<string>(hcard, "sex");

    if (noneOf([pronouns, genderIdentity, sex])) return null;
    return {
        pronouns: pronouns,
        genderIdentity: genderIdentity,
        sex: sex,
    };
};

const parseDates = (hcard: MicroformatProperties): HCardDates | null => {
    const birthday = Parse.get<string>(hcard, "bday");
    const anniversary = Parse.get<string>(hcard, "anniversary");

    if (!birthday && !anniversary) return null;
    return {
        birthday: birthday,
        anniversary: anniversary,
    };
};

const parseContact = (
    hcard: MicroformatProperties
): HCardContactData | null => {
    const url = Parse.get<string>(hcard, "url");
    const email = Parse.get<string>(hcard, "email");
    const phone = Parse.get<string>(hcard, "tel");
    const impp = Parse.get<string>(hcard, "impp");
    const key = Parse.get<string>(hcard, "key");

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
    const org: MicroformatProperty[] | null = Parse.get(hcard, "org");

    let orgHCard: HCardData | null = null;
    if (org) {
        orgHCard = parseHCard((org[0] as MicroformatRoot)?.properties);
    }

    const jobTitle = Parse.get<string>(hcard, "job-title");
    const role = Parse.get<string>(hcard, "role");

    if (noneOf([org, jobTitle, role])) return null;

    return {
        orgName: orgHCard?.name ?? org?.[0]?.toString() ?? null,
        orgHCard: orgHCard,
        jobTitle: jobTitle,
        role: role,
    };
};

const parseExtras = (hcard: MicroformatProperties): HCardExtras | null => {
    const uid = Parse.get<string>(hcard, "uid");
    const notes = Parse.get<string>(hcard, "note");
    const category = Parse.get<string>(hcard, "category");

    if (noneOf([uid, notes, category])) return null;

    return {
        uid: uid,
        notes: notes,
        category: category,
    };
};
