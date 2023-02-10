import { MicroformatProperty } from "microformats-parser/dist/types";
import { Parse } from "ts/data/parsing";
import {
    HEntryData,
    HEntryInteractions,
    RsvpValue,
    rsvpValueOf,
} from "ts/data/types/h-entry";

export const parseHEntry = (entry: MicroformatProperty): HEntryData | null => {
    const name = Parse.valueOf(entry, "name");
    const summary = Parse.valueOf(entry, "summary");
    const url = Parse.valueOf(entry, "url");
    const uid = Parse.valueOf(entry, "uid");
    const interactions = parseInteractions(entry);

    return {
        name: name,
        summary: summary,
        url: url,
        uid: uid,
        interactions: interactions,
        author: null,
        category: null,
        content: null,
        dates: null,
        location: null,
    };
};

const parseInteractions = (
    entry: MicroformatProperty
): HEntryInteractions | null => {
    const inReplyTo = Parse.valueOf(entry, "in-reply-to");
    const likeOf = Parse.valueOf(entry, "life-of");
    const repostOf = Parse.valueOf(entry, "repost-of");
    const rsvp = parseRsvp(entry);
    const syndication = Parse.getArray<string>(entry, "syndication");

    // if (noneOf([syndication, inReplyTo, rsvp])) return null;

    return {
        inReplyTo: inReplyTo,
        likeOf: likeOf,
        repostOf: repostOf,
        rsvp: rsvp,
        syndication: syndication,
    };
};

const parseRsvp = (entry: MicroformatProperty): RsvpValue | null => {
    const value = Parse.valueOf(entry, "rsvp");
    if (!value) return null;
    return rsvpValueOf(value);
};
