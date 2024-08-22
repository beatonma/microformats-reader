import { HGeoData } from "ts/data/types/h-geo";
import { EmbeddedHCard } from "ts/data/types/h-card";

export interface HAdrData extends HGeoData {
    locality: string[] | null;
    region: string[] | null;
    countryName: string[] | null;
    postalCode: string[] | null;
    streetAddress: string[] | null;
    extendedAddress: string[] | null;
    postOfficeBox: string[] | null;
    label: string[] | null;
    geo: string[] | null;
    value: string | null;
}

export type LocationData = string | EmbeddedHCard | HAdrData | HGeoData;
