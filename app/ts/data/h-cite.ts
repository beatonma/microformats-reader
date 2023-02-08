import { Author } from "ts/data/microformats";

/**
 * https://microformats.org/wiki/h-cite
 */
export interface HCiteData {
    name?: string;
    author?: Author;
    dates?: HCiteDates;
    url?: string;
    uid?: string;
    publication?: string;
    content?: string;
}
interface HCiteDates {
    published?: Date;
    accessed?: Date;
}
