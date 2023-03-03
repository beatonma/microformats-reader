export { HCardData } from "./h-card";
export { HFeedData } from "./h-feed";
export { HEntryData } from "./h-entry";
export { HGeoData } from "./h-geo";
export { HAdrData } from ".//h-adr";

export const isString = (obj: unknown): obj is string =>
    typeof obj === "string";

export const isUri = (obj: string | null | undefined): boolean =>
    obj?.match(/^(https?|irc[s6]?):\/\/\S+$/) != null ||
    obj?.match(/^(tel|mailto):(?!\/\/)\S+$/) != null;
