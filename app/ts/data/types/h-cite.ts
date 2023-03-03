import { EmbeddedHCard } from "ts/data/types/h-card";

/**
 * https://microformats.org/wiki/h-cite
 */
export interface HCiteData {
    name: string | null;
    author: EmbeddedHCard | null;
    dates: HCiteDates | null;
    url: string | null;
    uid: string | null;
    publication: string | null;
    content: string | null;
}
interface HCiteDates {
    published: string | null;
    accessed: string | null;
}
