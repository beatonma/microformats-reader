import { Image } from "microformats-parser/dist/types";
import { HAdrData } from "ts/data/types/h-adr";

export interface HCardData {
    id: string;
    name: string | null;
    nameDetail: HCardNameDetail | null;
    images: HCardImages | null;
    gender: HCardGenderIdentity | null;
    contact: HCardContactData | null;
    location: HAdrData | null;
    job: HCardJobData | null;
    dates: HCardDates | null;
    extras: HCardExtras | null;
}

export interface EmbeddedHCard {
    id: string;
    name: string | null;
    hcard: HCardData | null;
}

export interface HCardNameDetail {
    honorificPrefix: string[] | null;
    honorificSuffix: string[] | null;
    givenName: string[] | null;
    additionalName: string[] | null;
    familyName: string[] | null;
    sortBy: string[] | null;
    nickname: string[] | null;
    sound: string[] | null;
}

export interface HCardImages {
    photo: Image | null;
    logo: Image | null;
}

export interface HCardGenderIdentity {
    sex: string[] | null;
    genderIdentity: string[] | null;
    pronouns: string[] | null;
}

export interface HCardContactData {
    url: string[] | null;
    email: string[] | null;
    phone: string[] | null;
    impp: string[] | null;
    publicKey: string[] | null;
}

export interface HCardJobData {
    organisation: EmbeddedHCard | null;
    jobTitle: string[] | null;
    role: string[] | null;
}

export interface HCardDates {
    birthday: Date[] | null;
    anniversary: Date[] | null;
}

export interface HCardExtras {
    uid: string[] | null;
    category: string[] | null;
    notes: string[] | null;
}
