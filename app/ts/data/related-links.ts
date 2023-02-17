import { ParsedDocument } from "microformats-parser/dist/types";
import { noneOf } from "ts/data/arrays";

export interface RelLink {
    href: string;
    text: string;
    title: string;
    type: string | null;
}

export interface RelLinks {
    relme: RelLink[] | null;
    pgp: RelLink[] | null;
    feeds: RelLink[] | null;
    webmention: RelLink[] | null;
}

export const parseRelLinks = async (
    microformats: ParsedDocument
): Promise<RelLinks | null> =>
    new Promise((resolve, reject) => {
        const rels = microformats?.rels ?? null;
        if (rels == null) {
            resolve(null);
            return;
        }

        const relmeLinks = rels?.me ?? [];
        const pgpLinks = rels?.pgpkey ?? [];
        const feedLinks = rels?.alternate ?? [];
        const webmentionEndpoints = rels?.webmention ?? [];

        const build = (links: string[]): RelLink[] | null => {
            if (links.length === 0) return null;
            return links
                .map(url => {
                    const rel = microformats["rel-urls"][url];
                    return {
                        href: url,
                        text: rel.text.trim() ?? rel.title?.trim() ?? url,
                        title: rel.title?.trim() ?? url,
                        type: rel.type?.trim() ?? null,
                    };
                })
                .sort((a: RelLink, b: RelLink) => a.text.localeCompare(b.text));
        };

        const relme = build(relmeLinks);
        const pgp = build(pgpLinks);
        const feeds = build(feedLinks);
        const webmention = build(webmentionEndpoints);

        if (noneOf([relme, pgp, feeds, webmention])) {
            resolve(null);
        } else {
            resolve({
                relme: relme,
                pgp: pgp,
                feeds: feeds,
                webmention: webmention,
            });
        }
    });
