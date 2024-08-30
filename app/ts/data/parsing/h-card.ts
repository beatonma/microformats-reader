import {
    MicroformatProperties,
    MicroformatRoot,
    ParsedDocument,
} from "@microformats-parser";
import { Microformat, Microformats } from "ts/data/microformats";
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
import { nullable } from "ts/data/util/object";
import {
    parseLocation,
    parseLocationFromProperties,
} from "ts/data/parsing/location";

/*
 * Parsing.
 */

export const parseHCards = async (
    microformats: ParsedDocument,
): Promise<HCardData[] | null> =>
    Parse.getRootsOfType(microformats.items, Microformat.H.Card)
        .map(parseHCard)
        .nullIfEmpty() ?? null;

const generateId = () => Math.random().toString().replace(".", "");

const parseHCard = (hcard: MicroformatRoot): HCardData | null => {
    if (hcard == null) return null;
    const properties = hcard.properties;

    const name = Parse.get<string>(properties, Microformat.P.Name);
    const notes = Parse.get<string>(properties, Microformat.P.Note);
    const nameDetail = parseNameDetails(properties);
    const gender = parseGender(properties);
    const location = parseHCardLocation(hcard);
    const contact = parseContact(properties);
    const job = parseJob(properties);
    const dates = parseDates(properties);
    const images = parseImages(properties);
    const extras = parseExtras(properties);

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
    const photo = Parse.getImages(hcard, Microformat.U.Photo);
    const logo = Parse.getImages(hcard, Microformat.U.Logo);

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
    const Pronouns = Microformat.X.Pronouns;
    const pronouns =
        Parse.getExperimental<string>(hcard, Pronouns.Pronouns) ??
        Parse.getExperimental<string>(hcard, Pronouns.Pronoun);
    if (pronouns) return pronouns;

    const nominative =
        Parse.getExperimental<string>(hcard, Pronouns.Nominative) ?? [];
    const oblique =
        Parse.getExperimental<string>(hcard, Pronouns.Oblique) ?? [];
    const possessive =
        Parse.getExperimental<string>(hcard, Pronouns.Possessive) ?? [];

    return [...nominative, ...oblique, ...possessive].nullIfEmpty();
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
    const birthday = Parse.getDates(hcard, Microformat.Dt.Bday);
    const anniversary = Parse.getDates(hcard, Microformat.Dt.Anniversary);

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
    const org = parseEmbeddedHCards(hcard, Microformat.P.Org);

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

/**
 * Location may be found:
 * - property `p-adr` as a string or embedded `h-adr`
 * - property `p-geo` or `u-geo`, as a string or embedded `h-geo`
 * - Directly in the `h-card` properties, as the `h-card` spec includes all fields from the `h-adr` spec
 * - child `h-adr` object
 */
const parseHCardLocation = (hcard: MicroformatRoot): HAdrData[] | null =>
    parseLocationFromProperties(hcard.properties, [
        Microformat.P.Adr,
        Microformat.H.Geo,
    ]) ??
    [parseLocation(hcard)].nullIfEmpty() ??
    Parse.getRootsOfType(hcard.children ?? [], Microformat.H.Adr)
        ?.map(parseHCardLocation)
        ?.flat()
        ?.nullIfEmpty() ??
    null;

export const parseEmbeddedHCards = (
    container: MicroformatProperties,
    key: Microformats,
): EmbeddedHCard[] | null => {
    const objs = Parse.get<MicroformatRoot | string>(container, key);
    if (!objs) return null;

    return objs
        .map(it => {
            if (isString(it)) {
                return {
                    id: generateId(),
                    name: [it],
                    hcard: null,
                };
            }

            const hcard = parseHCard(it);
            if (!hcard) return null;
            return {
                id: generateId(),
                name: hcard.name ?? null,
                hcard: hcard,
            };
        })
        .nullIfEmpty();
};
