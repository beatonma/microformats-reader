import { ParsedDocument } from "@microformats-parser";
import { parseRelatedLinks } from "ts/data/parsing/related-links";
import { parseHCards } from "ts/data/parsing/h-card";
import { parseHFeeds } from "ts/data/parsing/h-feed";
import { mf2 } from "microformats-parser";
import { RelatedLinks } from "ts/data/types/rel";
import { HAdrData, HCardData, HFeedData } from "ts/data/types";
import { parseHEvents } from "ts/data/parsing/h-event";
import { HEventData } from "ts/data/types/h-event";
import { parseHAdrs, parseHGeos } from "ts/data/parsing/h-adr";

export interface MicroformatData {
    microformats: ParsedDocument;
    relLinks: RelatedLinks | null;
    hcards: HCardData[] | null;
    feeds: HFeedData[] | null;
    events: HEventData[] | null;
    locations: {
        adrs: HAdrData[] | null;
        geos: HAdrData[] | null;
    };
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
    const hEvents = await parseHEvents(parsed);
    const adrs = await parseHAdrs(parsed);
    const geos = await parseHGeos(parsed);

    return {
        microformats: parsed,
        relLinks: relatedLinks,
        hcards: hCards,
        feeds: hFeeds,
        events: hEvents,
        locations: {
            adrs: adrs,
            geos: geos,
        },
    };
};
