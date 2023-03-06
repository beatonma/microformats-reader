import { HAdrData } from "ts/data/types/h-adr";
import { EmbeddedHCard, HCardData } from "ts/data/types/h-card";
import { HCiteData } from "ts/data/types/h-cite";
import { HGeoData } from "ts/data/types/h-geo";

/**
 * https://microformats.org/wiki/h-entry
 *
 * Lots of proposed and experimental properties which we'll hopefully deal with later.
 */
export interface HEntryData {
    name: string | null;
    author: EmbeddedHCard | null;
    summary: string | null;
    content: string[] | null;
    dates: HEntryDates | null;
    category: string[] | null;
    url: string | null;
    uid: string | null;
    location: string | HCardData | HAdrData | HGeoData | null;
    interactions: HEntryInteractions | null;
}

export interface HEntryInteractions {
    syndication: string[] | null;
    inReplyTo: string | HCiteData | null;
    rsvp: RsvpValue | null;
    likeOf: string | HCiteData | null;
    repostOf: string | HCiteData | null;
}

export interface HEntryDates {
    published: Date[] | null;
    updated: Date[] | null;
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
