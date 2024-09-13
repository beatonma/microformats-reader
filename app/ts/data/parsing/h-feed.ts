import {
    MicroformatProperties,
    MicroformatRoot,
    ParsedDocument,
} from "@microformats-parser";
import { Microformat } from "ts/data/microformats";
import { parseEmbeddedHCards } from "ts/data/parsing/h-card";
import { parseHEntry } from "ts/data/parsing/h-entry";
import { Parse } from "ts/data/parsing/parse";
import { HFeedAbout, HFeedData } from "ts/data/types/h-feed";
import { noneOf } from "ts/data/util/arrays";
import { HEntryData } from "ts/data/types";

export const parseHFeeds = async (
    microformats: ParsedDocument,
): Promise<HFeedData[] | null> => {
    const feeds = Parse.getRootsOfType(
        microformats.items,
        Microformat.H.Feed,
    ).map(parseHFeed);

    const unwrappedEntries = wrapWithHFeed(
        Parse.getRootsOfType(microformats.items, Microformat.H.Entry),
    );

    return [...feeds, unwrappedEntries].nullIfEmpty();
};

const parseHFeed = (hfeed: MicroformatRoot): HFeedData | null => {
    const entries = hfeed.children
        ?.map(item => parseHEntry(item))
        ?.nullIfEmpty<HEntryData>();

    if (!entries) return null;

    const about = parseAbout(hfeed.properties);

    return {
        type: Microformat.H.Feed,
        about: about,
        entries: entries,
    };
};

const wrapWithHFeed = (entries: MicroformatRoot[]): HFeedData | null => {
    if (entries.length === 0) return null;

    return {
        type: Microformat.H.Feed,
        about: null,
        entries: entries.map(parseHEntry).nullIfEmpty(),
    };
};

const parseAbout = (properties: MicroformatProperties): HFeedAbout | null => {
    const name = Parse.get<string>(properties, Microformat.P.Name);
    const author = parseEmbeddedHCards(properties, Microformat.P.Author);
    const summary = Parse.get<string>(properties, Microformat.P.Summary);
    const url = Parse.get<string>(properties, Microformat.U.Url);
    const photo = Parse.getImages(properties, Microformat.U.Photo);

    if (noneOf([name, author, summary, url, photo])) return null;

    return {
        name: name,
        author: author,
        summary: summary,
        url: url,
        photo: photo,
    };
};
