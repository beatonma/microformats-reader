import { HAdrData } from ".//h-adr";
import { HCardData } from "./h-card";
import { HEntryData } from "./h-entry";
import { HFeedData } from "./h-feed";
import { HGeoData } from "./h-geo";

export type { HCardData } from "./h-card";
export type { HFeedData } from "./h-feed";
export type { HEntryData } from "./h-entry";
export type { HGeoData } from "./h-geo";
export type { HAdrData } from ".//h-adr";

export const isString = (obj: unknown): obj is string =>
    typeof obj === "string";

export const isUri = (obj: string | null | undefined): boolean =>
    obj?.match(/^(https?|irc[s6]?):\/\/\S+$/) != null ||
    obj?.match(/^(tel|mailto):(?!\/\/)\S+$/) != null;

export const isHCardData = (obj: any | null | undefined): obj is HCardData =>
    obj?.hasOwnProperty("nameDetail");

export const isHFeedData = (obj: any | null | undefined): obj is HFeedData =>
    obj?.hasOwnProperty("entries");

export const isHEntryData = (obj: any | null | undefined): obj is HEntryData =>
    obj?.hasOwnProperty("content");

export const isHAdrData = (obj: any | null | undefined): obj is HAdrData =>
    obj?.hasOwnProperty("locality");

export const isHGeoData = (obj: any | null | undefined): obj is HGeoData =>
    obj?.hasOwnProperty("latitude");
