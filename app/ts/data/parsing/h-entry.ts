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
import { nullable } from "ts/data/util/object";
import {
    parseLocation,
    parseLocationFromProperties,
} from "ts/data/parsing/location";
import { HAdrData, isString } from "ts/data/types";
import { HCiteData } from "ts/data/types/h-cite";

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
    const photo = Parse.getImages(properties, Microformat.U.Photo);
    const video = Parse.getImages(properties, Microformat.U.Video);

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
            photo: photo,
            video: video,
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
    const inReplyTo = parseCitation(entry, Microformat.U.InReplyTo);
    const likeOf = parseCitation(entry, Microformat.U.LikeOf);
    const repostOf = parseCitation(entry, Microformat.U.RepostOf);
    const rsvp = parseRsvp(entry);
    const syndication = Parse.get<string>(entry, Microformat.U.Syndication);

    return nullable({
        inReplyTo: inReplyTo,
        likeOf: likeOf,
        repostOf: repostOf,
        rsvp: rsvp,
        syndication: syndication,
    });
};

const parseRsvp = (entry: MicroformatProperties): RsvpValue[] | null =>
    Parse.get<string>(entry, Microformat.P.Rsvp)
        ?.map(rsvpValueOf)
        ?.nullIfEmpty() ?? null;

const parseDates = (entry: MicroformatProperties): HEntryDates | null => {
    const published = Parse.getDates(entry, Microformat.Dt.Published);
    const updated = Parse.getDates(entry, Microformat.Dt.Updated);

    return nullable({
        published: published,
        updated: updated,
    });
};

const parseCitation = (
    entry: MicroformatProperties,
    key: string,
): HCiteData[] | null => {
    const data = Parse.get<MicroformatRoot | string>(entry, key);

    return (
        data
            ?.map(obj => {
                if (isString(obj)) {
                    return {
                        author: null,
                        content: null,
                        dateAccessed: null,
                        datePublished: null,
                        name: null,
                        publication: null,
                        uid: null,
                        url: [obj],
                    };
                }

                const cite = obj.properties;
                return {
                    author: parseEmbeddedHCards(cite, Microformat.P.Author),
                    content: Parse.get<string>(cite, Microformat.P.Content),
                    dateAccessed: Parse.getDates(cite, Microformat.Dt.Accessed),
                    datePublished: Parse.getDates(
                        cite,
                        Microformat.Dt.Published,
                    ),
                    name: Parse.get<string>(cite, Microformat.P.Name),
                    publication: Parse.get<string>(
                        cite,
                        Microformat.P.Publication,
                    ),
                    uid: Parse.get<string>(cite, Microformat.U.Uid),
                    url: Parse.get<string>(cite, Microformat.U.Url),
                };
            })
            .nullIfEmpty() ?? null
    );
};
