import { Author } from "ts/data/types/h-entry";

/**
 * https://microformats.org/wiki/h-cite
 */
export interface HCiteData {
    name: string | null;
    author: Author | null;
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
