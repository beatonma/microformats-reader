import { Author, DateOrString, HData } from "ts/data/types/common";
import { Microformat } from "ts/data/microformats";

/**
 * https://microformats.org/wiki/h-cite
 */
export interface HCiteData extends HData {
    type: Microformat.H.Cite;
    name: string[] | null;
    author: Author[] | null;
    datePublished: DateOrString[] | null;
    dateAccessed: DateOrString[] | null;
    url: string[] | null;
    uid: string[] | null;
    publication: string[] | null;
    content: string[] | null;
}
