import { Author, DateOrString } from "ts/data/types/common";

/**
 * https://microformats.org/wiki/h-cite
 */
export interface HCiteData {
    name: string[] | null;
    author: Author[] | null;
    datePublished: DateOrString[] | null;
    dateAccessed: DateOrString[] | null;
    url: string[] | null;
    uid: string[] | null;
    publication: string[] | null;
    content: string[] | null;
}
