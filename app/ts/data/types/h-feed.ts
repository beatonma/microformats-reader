import { HEntryData } from "ts/data/types/h-entry";
import { Image } from "@microformats-parser";
import { Author, HData } from "ts/data/types/common";
import { Microformat } from "ts/data/microformats";

/**
 * https://microformats.org/wiki/h-feed
 */
export interface HFeedData extends HData {
    type: Microformat.H.Feed;
    about: HFeedAbout | null;
    entries: HEntryData[] | null;
}

export interface HFeedAbout {
    name: string[] | null;
    author: Author[] | null;
    url: string[] | null;
    summary: string[] | null;
    photo: Image[] | null;
}
