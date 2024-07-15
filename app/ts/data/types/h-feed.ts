import { EmbeddedHCard } from "ts/data/types/h-card";
import { HEntryData } from "ts/data/types/h-entry";
import { Image } from "@microformats-parser";

/**
 * https://microformats.org/wiki/h-feed
 */
export interface HFeedData {
    about: HFeedAbout | null;
    entries: HEntryData[] | null;
}

export interface HFeedAbout {
    name: string | null;
    author: EmbeddedHCard | null;
    url: string | null;
    summary: string | null;
    photo: Image | null;
}
