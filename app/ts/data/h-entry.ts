import { MicroformatProperties } from "microformats-parser/dist/types";
import { noneOf } from "ts/data/arrays";
import { Parse } from "ts/data/parse";
import {
    Author,
    HEntryData,
    HEntryInteractions,
    RsvpValue,
    rsvpValueOf,
} from "ts/data/types/h-entry";

export const parseHEntry = (
    entry: MicroformatProperties
): HEntryData | null => {
    const name = Parse.first<string>(entry, "name");
    const summary = Parse.first<string>(entry, "summary");
    const url = Parse.first<string>(entry, "url");
    const uid = Parse.first<string>(entry, "uid");
    const category = Parse.first<string>(entry, "category");
    const content = Parse.first<string>(entry, "content");
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
    entry: MicroformatProperties
): HEntryInteractions | null => {
    const inReplyTo = Parse.first<string>(entry, "in-reply-to");
    const likeOf = Parse.first<string>(entry, "life-of");
    const repostOf = Parse.first<string>(entry, "repost-of");
    const rsvp = parseRsvp(entry);
    const syndication = Parse.get<string>(entry, "syndication");

    if (noneOf([inReplyTo, likeOf, repostOf, rsvp, syndication])) return null;

    return {
        inReplyTo: inReplyTo,
        likeOf: likeOf,
        repostOf: repostOf,
        rsvp: rsvp,
        syndication: syndication,
    };
};

const parseRsvp = (entry: MicroformatProperties): RsvpValue | null => {
    const value = Parse.first<string>(entry, "rsvp");
    if (!value) return null;
    return rsvpValueOf(value);
};
