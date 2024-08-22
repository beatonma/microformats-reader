import { MicroformatProperties, MicroformatRoot } from "@microformats-parser";
import { Microformat } from "ts/data/microformats";
import { parseEmbeddedHCards } from "ts/data/parsing/h-card";
import { Parse } from "ts/data/parsing/parse";
import {
    HEntryData,
    HEntryDates,
    HEntryInteractions,
    RsvpValue,
    rsvpValueOf,
} from "ts/data/types/h-entry";
import { noneOf } from "ts/data/util/arrays";
import { nullable } from "ts/data/util/object";
import {
    parseLocation,
    parseLocationFromProperties,
} from "ts/data/parsing/location";
import { HAdrData } from "ts/data/types";

export const parseHEntry = (entry: MicroformatRoot): HEntryData | null => {
    const properties = entry.properties;

    const name = Parse.get<string>(properties, Microformat.P.Name);
    const summary = Parse.get<string>(properties, Microformat.P.Summary);
    const url = Parse.get<string>(properties, Microformat.U.Url);
    const uid = Parse.get<string>(properties, Microformat.U.Uid);
    const category = Parse.get<string>(properties, Microformat.P.Category);
    const content = Parse.getEmbeddedValue(properties, Microformat.E.Content);
    const interactions = parseInteractions(properties);
    const dates = parseDates(properties);
    const author = parseEmbeddedHCards(properties, Microformat.P.Author);
    const location =
        parseLocationFromProperties(properties, [Microformat.P.Location]) ??
        parseLocationFromChildren(entry.children) ??
        parseEmbeddedHCards(properties, Microformat.P.Location) ??
        null;

    return nullable(
        {
            name: name,
            summary: summary,
            url: url,
            uid: uid,
            interactions: interactions,
            category: category,
            content: content,
            dates: dates,
            author: author,
            location: location,
        },
        { requireAnyKey: ["name", "summary", "url"] },
    );
};

const parseLocationFromChildren = (
    children: MicroformatRoot[] | undefined,
): HAdrData[] | null =>
    (
        Parse.getRootsOfType(children ?? [], Microformat.H.Adr) ??
        Parse.getRootsOfType(children ?? [], Microformat.H.Adr)
    )
        ?.map(it => parseLocation(it))
        ?.nullIfEmpty() ?? null;

const parseInteractions = (
    entry: MicroformatProperties,
): HEntryInteractions | null => {
    const inReplyTo = Parse.get<string>(entry, Microformat.U.InReplyTo);
    const likeOf = Parse.get<string>(entry, Microformat.U.LikeOf);
    const repostOf = Parse.get<string>(entry, Microformat.U.RepostOf);
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
    const value = Parse.single<string>(entry, Microformat.P.Rsvp);
    if (!value) return null;
    return rsvpValueOf(value);
};

const parseDates = (entry: MicroformatProperties): HEntryDates | null => {
    const published = Parse.getDates(entry, Microformat.Dt.Published);
    const updated = Parse.getDates(entry, Microformat.Dt.Updated);

    if (noneOf([published, updated])) return null;

    return {
        published: published,
        updated: updated,
    };
};
