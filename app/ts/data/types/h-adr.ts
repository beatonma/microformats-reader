import { HGeoData } from "ts/data/types/h-geo";
import { EmbeddedHCard } from "ts/data/types/h-card";
import { HData } from "ts/data/types/common";
import { Microformat } from "ts/data/microformats";

export interface HAdrData extends HData {
    type: Microformat.H.Adr;
    locality: string[] | null;
    region: string[] | null;
    countryName: string[] | null;
    postalCode: string[] | null;
    streetAddress: string[] | null;
    extendedAddress: string[] | null;
    postOfficeBox: string[] | null;
    label: string[] | null;
    geo: (HGeoData | string)[] | null;
    value: string | null;
}

/**
 * Source data may be `h-adr`, `h-geo`, `h-card` or just a string.
 * `h-adr`, `h-geo` and string are all coerced into `HAdrData`.
 * `h-card` is handled as `EmbeddedHCard`.
 */
export type LocationData = HAdrData | EmbeddedHCard;
