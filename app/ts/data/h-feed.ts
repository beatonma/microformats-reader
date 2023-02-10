import {
    Image,
    MicroformatRoot,
    ParsedDocument,
} from "microformats-parser/dist/types";
import { anyOf, notNullish } from "ts/data/arrays";
import { parseHEntry } from "ts/data/h-entry";
import { Microformat } from "ts/data/microformats";
import { Parse } from "ts/data/parsing";
import { HFeedData } from "ts/data/types/h-feed";

export const parseHFeeds = async (
    microformats: ParsedDocument
): Promise<HFeedData[]> => {
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

        resolve([...feeds, unwrappedEntries].filter(notNullish));
    });
};

const parseHFeed = (hfeed: MicroformatRoot): HFeedData | null => {
    const name = Parse.valueOf(hfeed, "name");
    const author = Parse.valueOf(hfeed, "author");
    const summary = Parse.valueOf(hfeed, "summary");
    const url = Parse.valueOf(hfeed, "url");
    const photo = Parse.parseFirst(hfeed, "photo") as Image;

    const entries = hfeed["children"]?.map(parseHEntry).filter(notNullish);

    if (!entries) return null;

    let about = null;

    if (anyOf([name, author, summary, url, photo])) {
        about = {
            name: name,
            author: author,
            summary: summary,
            url: url,
            photo: photo,
        };
    }

    return {
        about: about,
        entries: entries,
    };
};

const wrapWithHFeed = (entries: MicroformatRoot[]): HFeedData | null => {
    if (entries.length === 0) return null;

    return {
        about: null,
        entries: entries.map(parseHEntry).filter(notNullish),
    };
};
