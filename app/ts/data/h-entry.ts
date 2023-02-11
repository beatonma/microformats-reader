import { MicroformatProperty } from "microformats-parser/dist/types";
import { noneOf } from "ts/data/arrays";
import { Parse } from "ts/data/parsing";
import {
    Author,
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
    const category = Parse.valueOf(entry, "category");
    const content = Parse.valueOf(entry, "content");
    const interactions = parseInteractions(entry);

    return {
        name: name,
        summary: summary,
        url: url,
        uid: uid,
        interactions: interactions,
        category: category,
        content: content,
        author: null,
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

    if (noneOf([inReplyTo, likeOf, repostOf, rsvp, syndication])) return null;

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
