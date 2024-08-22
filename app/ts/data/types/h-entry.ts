import { EmbeddedHCard } from "ts/data/types/h-card";
import { HCiteData } from "ts/data/types/h-cite";
import { DateOrString } from "ts/data/types/common";
import { LocationData } from "ts/data/types/h-adr";

/**
 * https://microformats.org/wiki/h-entry
 *
 * Lots of proposed and experimental properties which we'll hopefully deal with later.
 */
export interface HEntryData {
    name: string[] | null;
    author: EmbeddedHCard[] | null;
    summary: string[] | null;
    content: string[] | null;
    dates: HEntryDates | null;
    category: string[] | null;
    url: string[] | null;
    uid: string[] | null;
    location: LocationData[] | null;
    interactions: HEntryInteractions | null;
}

export interface HEntryInteractions {
    syndication: string[] | null;
    inReplyTo: string[] | HCiteData | null;
    rsvp: RsvpValue | null;
    likeOf: string[] | HCiteData | null;
    repostOf: string[] | HCiteData | null;
}

export interface HEntryDates {
    published: DateOrString[] | null;
    updated: DateOrString[] | null;
}

export enum RsvpValue {
    Yes,
    No,
    Maybe,
    Interested,
}
export const rsvpValueOf = (name?: string | null): RsvpValue | null => {
    if (!name) return null;
    const key = Object.keys(RsvpValue)
        .map(it => it as keyof typeof RsvpValue)
        .find(key => key.toLowerCase() === name.toLowerCase());

    if (!key) return null;
    return RsvpValue[key];
};
