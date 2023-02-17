export { HCardData } from "./h-card";
export { HFeedData } from "./h-feed";
export { HEntryData } from "./h-entry";
export { HGeoData } from "./h-geo";
export { HAdrData } from ".//h-adr";

export const isString = (obj: unknown): obj is string =>
    typeof obj === "string";
