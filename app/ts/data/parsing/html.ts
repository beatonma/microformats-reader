import { ParsedDocument } from "@microformats-parser";
import { mf2 } from "microformats-parser";
import { parseHAdrs, parseHGeos } from "ts/data/parsing/h-adr";
import { parseHCards } from "ts/data/parsing/h-card";
import { parseHEvents } from "ts/data/parsing/h-event";
import { parseHFeeds } from "ts/data/parsing/h-feed";
import { MicroformatData } from "ts/data/types";
import { parseRelatedLinks } from "ts/data/parsing/related-links";
import { nullable } from "ts/data/util/object";

export const parse = async (
    html: string,
    baseUrl: string,
): Promise<MicroformatData> => {
    const microformats = loadMicroformats(cleanClasses(html), baseUrl);
    return parseDocument(microformats);
};

/**
 * Remove any classes that look like `h-` containers but aren't really.
 * e.g. tailwindcss height utilities like `h-full`, `h-4`
 */
const cleanClasses = (html: string): string => {
    const container = document.createElement("div");
    container.innerHTML = html;
    container.querySelectorAll("[class]").forEach(el => {
        // Remove any classes with an `h-` prefix that
        // don't match a supported `h-` container
        try {
            const removedClasses: string[] = [];
            el.classList.forEach(cls => {
                if (
                    cls.match(/^(h-(?!adr|card|entry|feed|geo|cite|event)\w+)/)
                ) {
                    removedClasses.push(cls);
                }
            });
            el.classList.remove(...removedClasses);
        } catch (e) {
            // el.className is not a simple string e.g. SVGAnimatedString
        }
    });

    return container.innerHTML;
};

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
        locations: nullable({
            adrs: adrs,
            geos: geos,
        }),
    };
};

export const _private = {
    cleanClasses,
};
