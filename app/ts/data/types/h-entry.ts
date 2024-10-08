import { HCiteData } from "ts/data/types/h-cite";
import { Author, DateOrString, HData } from "ts/data/types/common";
import { LocationData } from "ts/data/types/h-adr";
import { Image } from "@microformats-parser";
import { Microformat } from "ts/data/microformats";

/**
 * https://microformats.org/wiki/h-entry
 *
 * Lots of proposed and experimental properties which we'll hopefully deal with later.
 */
export interface HEntryData extends HData {
    type: Microformat.H.Entry;
    name: string[] | null;
    author: Author[] | null;
    summary: string[] | null;
    content: string[] | null;
    dates: HEntryDates | null;
    category: string[] | null;
    url: string[] | null;
    uid: string[] | null;
    location: LocationData[] | null;
    interactions: HEntryInteractions | null;
    photo: Image[] | null;
    video: Image[] | null;
}

export interface HEntryInteractions {
    inReplyTo: HCiteData[] | null;
    likeOf: HCiteData[] | null;
    repostOf: HCiteData[] | null;
    rsvp: RsvpValue[] | null;
    syndication: string[] | null;
}

export interface HEntryDates {
    published: DateOrString[] | null;
    updated: DateOrString[] | null;
}

export enum RsvpValue {
    Yes = "yes",
    No = "no",
    Maybe = "maybe",
    Interested = "interested",
}
export const rsvpValueOf = (name?: string | null): RsvpValue | null => {
    if (!name) return null;
    const key = Object.keys(RsvpValue)
        .map(it => it as keyof typeof RsvpValue)
        .find(key => key.toLowerCase() === name.toLowerCase());

    if (!key) return null;
    return RsvpValue[key];
};
