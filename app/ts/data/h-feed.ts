import {
    Image,
    MicroformatProperties,
    MicroformatProperty,
    MicroformatRoot,
    ParsedDocument,
} from "microformats-parser/dist/types";
import { anyOf, noneOf } from "ts/data/arrays";
import { HAdr, HCardData, HGeo } from "ts/data/h-card";
import { HCiteData } from "ts/data/h-cite";
import { Author, Parse } from "ts/data/microformats";

/**
 * https://microformats.org/wiki/h-feed
 */
export interface HFeedData {
    about?: HFeedAbout;
    entries?: HEntryData[];
}
export interface HFeedAbout {
    name?: string;
    author?: Author;
    url?: string;
    summary?: string;
    photo?: Image;
}

/**
 * https://microformats.org/wiki/h-entry
 *
 * Lots of proposed and experimental properties which we'll hopefully deal with later.
 */
export interface HEntryData {
    name?: string;
    summary?: string;
    content?: string;
    dates?: HEntryDates;
    author?: Author;
    category?: string;
    url?: string;
    uid?: string;
    location?: string | HCardData | HAdr | HGeo;
    syndication?: string[];
    inReplyTo?: string | HCiteData;
    rsvp?: RsvpValue;
    lifeOf?: string | HCiteData;
    repostOf?: string | HCiteData;
}
interface HEntryDates {
    published?: Date;
    updated?: Date;
}
enum RsvpValue {
    Yes,
    No,
    Naybe,
    Interested,
}

export const parseHFeeds = async (
    microformats: ParsedDocument
): Promise<HFeedData[]> => {
    return new Promise((resolve, reject) => {
        const feeds: MicroformatRoot[] = microformats.items.filter(item =>
            item.type.includes("h-feed")
        );

        resolve(feeds.map(parseHFeed).filter(Boolean));
    });
};

const parseHFeed = (hfeed: MicroformatRoot): HFeedData | null => {
    const name = Parse.valueOf(hfeed, "name");
    const author = Parse.valueOf(hfeed, "author");
    const summary = Parse.valueOf(hfeed, "summary");
    const url = Parse.valueOf(hfeed, "url");
    const photo = Parse.parseFirst(hfeed, "photo") as Image;

    const entries = hfeed["children"]?.map(entry => parseHEntry(entry));

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

const parseHEntry = (entry: MicroformatProperty): HEntryData | null => {
    const name = Parse.valueOf(entry, "name");
    const summary = Parse.valueOf(entry, "summary");
    const url = Parse.valueOf(entry, "url");

    return {
        name: name,
        summary: summary,
        url: url,
    };
};
