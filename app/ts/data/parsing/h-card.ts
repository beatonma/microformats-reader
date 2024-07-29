import {
    MicroformatProperties,
    MicroformatRoot,
    ParsedDocument,
} from "@microformats-parser";
import { Microformat } from "ts/data/microformats";
import { Parse } from "ts/data/parsing/parse";
import { HAdrData, isString } from "ts/data/types";
import {
    EmbeddedHCard,
    HCardContactData,
    HCardData,
    HCardDates,
    HCardExtras,
    HCardGenderIdentity,
    HCardImages,
    HCardJobData,
    HCardNameDetail,
} from "ts/data/types/h-card";
import { isEmpty, notNullish, takeIfNotEmpty } from "ts/data/util/arrays";
import { nullable } from "ts/data/util/object";
import { parseLocation } from "ts/data/parsing/location";

/*
 * Parsing.
 */

export const parseHCards = async (
    microformats: ParsedDocument,
): Promise<HCardData[] | null> =>
    new Promise((resolve, reject) => {
        const items = Parse.getRootsOfType(
            microformats.items,
            Microformat.H.Card,
        ).map(item => item.properties);

        const primaryHcards = items.map(parseHCard).filter(notNullish);
        if (isEmpty(primaryHcards)) {
            resolve(null);
            return;
        }

        resolve(primaryHcards);

        // const hcards: HCardData[] = [];
        // primaryHcards.forEach((hcard, index) => {
        //     hcards.push(hcard);
        //     if (hcard.job?.orgHCard != null) hcards.push(hcard.job.orgHCard);
        // });

        // resolve(hcards);
    });

const generateId = () => Math.random().toString().replace(".", "");

const parseHCard = (hcard: MicroformatProperties): HCardData | null => {
    if (hcard == null) return null;

    const name = Parse.first<string>(hcard, Microformat.P.Name);
    const notes = Parse.get<string>(hcard, Microformat.P.Note);
    const nameDetail = parseNameDetails(hcard);
    const gender = parseGender(hcard);
    const location = parseLocation(hcard);
    const contact = parseContact(hcard);
    const job = parseJob(hcard);
    const dates = parseDates(hcard);
    const images = parseImages(hcard);
    const extras = parseExtras(hcard);

    return nullable(
        {
            id: generateId(),
            name: name,
            notes: notes,
            nameDetail: nameDetail,
            gender: gender,
            location: location,
            contact: contact,
            job: job,
            dates: dates,
            images: images,
            extras: extras,
        },
        { ignoredKeys: ["id"] },
    );
};

const parseImages = (hcard: MicroformatProperties): HCardImages | null => {
    const photo = Parse.firstImage(hcard, Microformat.U.Photo);
    const logo = Parse.firstImage(hcard, Microformat.U.Logo);

    return nullable({
        photo: photo,
        logo: logo,
    });
};

const parseNameDetails = (
    hcard: MicroformatProperties,
): HCardNameDetail | null => {
    const honorificPrefix = Parse.get<string>(
        hcard,
        Microformat.P.Honorific_Prefix,
    );
    const honorificSuffix = Parse.get<string>(
        hcard,
        Microformat.P.Honorific_Suffix,
    );
    const givenName = Parse.get<string>(hcard, Microformat.P.Given_Name);
    const additionalName = Parse.get<string>(
        hcard,
        Microformat.P.Additional_Name,
    );
    const familyName = Parse.get<string>(hcard, Microformat.P.Family_Name);
    const sortBy = Parse.get<string>(hcard, Microformat.P.Sort_String);
    const nickname = Parse.get<string>(hcard, Microformat.P.Nickname);
    const sound = Parse.get<string>(hcard, Microformat.U.Sound);

    return nullable({
        honorificPrefix: honorificPrefix,
        honorificSuffix: honorificSuffix,
        givenName: givenName,
        additionalName: additionalName,
        familyName: familyName,
        sortBy: sortBy,
        nickname: nickname,
        sound: sound,
    });
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

    return takeIfNotEmpty([...nominative, ...oblique, ...possessive]);
};

const parseGender = (
    hcard: MicroformatProperties,
): HCardGenderIdentity | null => {
    const pronouns = parsePronouns(hcard);
    const genderIdentity = Parse.get<string>(
        hcard,
        Microformat.P.Gender_Identity,
    );
    const sex = Parse.get<string>(hcard, Microformat.P.Sex);

    return nullable({
        pronouns: pronouns,
        genderIdentity: genderIdentity,
        sex: sex,
    });
};

const parseDates = (hcard: MicroformatProperties): HCardDates | null => {
    const birthday = Parse.getDate(hcard, Microformat.Dt.Bday);
    const anniversary = Parse.getDate(hcard, Microformat.Dt.Anniversary);

    return nullable({
        birthday: birthday,
        anniversary: anniversary,
    });
};

const parseContact = (
    hcard: MicroformatProperties,
): HCardContactData | null => {
    const url = Parse.get<string>(hcard, Microformat.U.Url);
    const email = Parse.get<string>(hcard, Microformat.U.Email);
    const phone = Parse.get<string>(hcard, Microformat.P.Tel);
    const impp = Parse.get<string>(hcard, Microformat.U.IMPP);
    const key = Parse.get<string>(hcard, Microformat.U.Key);

    return nullable({
        url: url,
        email: email,
        phone: phone,
        impp: impp,
        publicKey: key,
    });
};

const parseJob = (hcard: MicroformatProperties): HCardJobData | null => {
    const org = parseEmbeddedHCard(hcard, Microformat.P.Org);

    const jobTitle = Parse.get<string>(hcard, Microformat.P.Job_Title);
    const role = Parse.get<string>(hcard, Microformat.P.Role);

    return nullable({
        organisation: org,
        jobTitle: jobTitle,
        role: role,
    });
};

const parseExtras = (hcard: MicroformatProperties): HCardExtras | null => {
    const uid = Parse.get<string>(hcard, Microformat.U.Uid);
    const category = Parse.get<string>(hcard, Microformat.P.Category);

    return nullable({
        uid: uid,
        category: category,
    });
};

export const parseEmbeddedHCard = (
    container: MicroformatProperties,
    key: string,
): EmbeddedHCard | null => {
    const obj = Parse.first<MicroformatRoot | string>(container, key);
    if (obj == null) return null;

    if (isString(obj)) {
        return {
            id: generateId(),
            name: obj,
            hcard: null,
        };
    }

    const hcard = parseHCard(obj.properties);
    return {
        id: generateId(),
        name: hcard?.name ?? null,
        hcard: hcard,
    };
};
