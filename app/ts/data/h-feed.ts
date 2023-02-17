import {
    MicroformatProperties,
    MicroformatRoot,
    ParsedDocument,
} from "microformats-parser/dist/types";
import { isEmpty, isEmptyOrNull, noneOf, notNullish } from "ts/data/arrays";
import { parseHEntry } from "ts/data/h-entry";
import { Microformat } from "ts/data/microformats";
import { Parse } from "ts/data/parse";
import { HFeedAbout, HFeedData } from "ts/data/types/h-feed";

export const parseHFeeds = async (
    microformats: ParsedDocument
): Promise<HFeedData[] | null> => {
    return new Promise((resolve, reject) => {
        const feeds = Parse.getRootsOfType(
            microformats,
            Microformat.Root.H_Feed
        )
            .map(parseHFeed)
            .filter(notNullish);

        const unwrappedEntries = wrapWithHFeed(
            Parse.getRootsOfType(microformats, Microformat.Root.H_Entry)
        );

        const result = [...feeds, unwrappedEntries].filter(notNullish);
        if (isEmpty(result)) {
            resolve(null);
            return;
        }

        resolve(result);
    });
};

const parseHFeed = (hfeed: MicroformatRoot): HFeedData | null => {
    const entries = hfeed.children
        ?.map(item => parseHEntry(item.properties))
        .filter(notNullish);

    if (isEmptyOrNull(entries)) return null;

    const about = parseAbout(hfeed.properties);

    return {
        about: about,
        entries: entries,
    };
};

const wrapWithHFeed = (entries: MicroformatRoot[]): HFeedData | null => {
    if (entries.length === 0) return null;

    return {
        about: null,
        entries: entries
            .map(item => parseHEntry(item.properties))
            .filter(notNullish),
    };
};

const parseAbout = (properties: MicroformatProperties): HFeedAbout | null => {
    const name = Parse.first<string>(properties, "name");
    const author = Parse.first<string>(properties, "author");
    const summary = Parse.first<string>(properties, "summary");
    const url = Parse.first<string>(properties, "url");
    const photo = Parse.firstImage(properties, "photo");

    if (noneOf([name, author, summary, url, photo])) return null;

    return {
        name: name,
        author: author,
        summary: summary,
        url: url,
        photo: photo,
    };
};
