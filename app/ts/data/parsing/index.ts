import { ParsedDocument } from "@microformats-parser";
import { parseRelatedLinks } from "ts/data/parsing/related-links";
import { parseHCards } from "ts/data/parsing/h-card";
import { parseHFeeds } from "ts/data/parsing/h-feed";
import { dump } from "ts/dev";
import { mf2 } from "microformats-parser";
import { RelatedLinks } from "ts/data/types/rel";
import { HCardData, HFeedData } from "ts/data/types";

export interface MicroformatData {
    microformats: ParsedDocument;
    relLinks: RelatedLinks | null;
    hcards: HCardData[] | null;
    feeds: HFeedData[] | null;
}

export const parse = (
    html: string,
    baseUrl: string,
): Promise<MicroformatData> => parseDocument(loadMicroformats(html, baseUrl));

const loadMicroformats = (html: string, baseUrl: string): ParsedDocument =>
    mf2(html, {
        baseUrl: baseUrl,
        experimental: {
            lang: true,
            textContent: true,
        },
    });

const parseDocument = async (
    parsed: ParsedDocument,
): Promise<MicroformatData> => {
    const relatedLinks = await parseRelatedLinks(parsed);
    const hCards = await parseHCards(parsed);
    const hFeeds = await parseHFeeds(parsed);

    dump(parsed);

    return {
        microformats: parsed,
        relLinks: relatedLinks,
        hcards: hCards,
        feeds: hFeeds,
    };
};
