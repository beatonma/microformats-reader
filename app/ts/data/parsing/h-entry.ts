import { MicroformatProperties } from "microformats-parser/dist/types";
import { Microformat } from "ts/data/microformats";
import { Parse } from "ts/data/parsing/parse";
import {
    Author,
    HEntryData,
    HEntryDates,
    HEntryInteractions,
    RsvpValue,
    rsvpValueOf,
} from "ts/data/types/h-entry";
import { noneOf } from "ts/data/util/arrays";

export const parseHEntry = (
    entry: MicroformatProperties
): HEntryData | null => {
    const name = Parse.first<string>(entry, Microformat.P.Name);
    const summary = Parse.first<string>(entry, Microformat.P.Summary);
    const url = Parse.first<string>(entry, Microformat.U.Url);
    const uid = Parse.first<string>(entry, Microformat.U.Uid);
    const category = Parse.first<string>(entry, Microformat.P.Category);
    const content = Parse.getEmbeddedValue(entry, Microformat.E.Content);
    const interactions = parseInteractions(entry);
    const dates = parseDates(entry);
    const author = null;
    const location = null;

    return {
        name: name,
        summary: summary,
        url: url,
        uid: uid,
        interactions: interactions,
        category: category,
        content: content,
        dates: dates,
        author: null,
        location: null,
    };
};

const parseInteractions = (
    entry: MicroformatProperties
): HEntryInteractions | null => {
    const inReplyTo = Parse.first<string>(entry, Microformat.U.InReplyTo);
    const likeOf = Parse.first<string>(entry, Microformat.U.LikeOf);
    const repostOf = Parse.first<string>(entry, Microformat.U.RepostOf);
    const rsvp = parseRsvp(entry);
    const syndication = Parse.get<string>(entry, Microformat.U.Syndication);

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
    const value = Parse.first<string>(entry, Microformat.P.Rsvp);
    if (!value) return null;
    return rsvpValueOf(value);
};

const parseDates = (entry: MicroformatProperties): HEntryDates | null => {
    const published = Parse.first<string>(entry, Microformat.Dt.Published);
    const updated = Parse.first<string>(entry, Microformat.Dt.Updated);

    if (noneOf([published, updated])) return null;

    return {
        published: published,
        updated: updated,
    };
};