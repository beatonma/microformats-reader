import { HData } from "ts/data/types/common";
import { Microformat } from "ts/data/microformats";

export interface HGeoData extends HData {
    type: Microformat.H.Geo;
    latitude: string | null;
    longitude: string | null;
    altitude: string | null;
}
