import { HEntryData } from "ts/data/types/h-entry";
import { Image } from "@microformats-parser";
import { Author } from "ts/data/types/common";

/**
 * https://microformats.org/wiki/h-feed
 */
export interface HFeedData {
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
