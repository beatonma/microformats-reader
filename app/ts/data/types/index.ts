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
