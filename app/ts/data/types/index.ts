import { HAdrData } from ".//h-adr";
import { HCardData } from "./h-card";
import { HEntryData } from "./h-entry";
import { HFeedData } from "./h-feed";
import { HGeoData } from "./h-geo";
import { Microformat } from "ts/data/microformats";

export type { HCardData } from "./h-card";
export type { HFeedData } from "./h-feed";
export type { HEntryData } from "./h-entry";
export type { HGeoData } from "./h-geo";
export type { HAdrData } from ".//h-adr";

export const isString = (obj: unknown): obj is string =>
    typeof obj === "string";

export const isUri = (obj: unknown | null | undefined): obj is string =>
    isString(obj) &&
    (obj?.match(/^(https?|irc[s6]?):\/\/\S+$/) != null ||
        obj?.match(/^(tel|mailto):(?!\/\/)\S+$/) != null ||
        obj?.match(/^#\w+$/) != null);

export const isHCardData = (obj: any | null | undefined): obj is HCardData =>
    obj?.type === Microformat.H.Card;

export const isHFeedData = (obj: any | null | undefined): obj is HFeedData =>
    obj?.type === Microformat.H.Feed;

export const isHEntryData = (obj: any | null | undefined): obj is HEntryData =>
    obj?.type === Microformat.H.Entry;

export const isHAdrData = (obj: any | null | undefined): obj is HAdrData =>
    obj?.type === Microformat.H.Adr;

export const isHGeoData = (obj: any | null | undefined): obj is HGeoData =>
    obj?.type === Microformat.H.Geo;
