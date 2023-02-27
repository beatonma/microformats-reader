import { ParsedDocument } from "microformats-parser/dist/types";
import { RelLink, RelatedLinks } from "ts/data/types/rel";
import { noneOf } from "ts/data/util/arrays";

export const parseRelatedLinks = async (
    microformats: ParsedDocument
): Promise<RelatedLinks | null> =>
    new Promise((resolve, reject) => {
        const rels = microformats?.rels ?? null;
        if (rels == null) {
            resolve(null);
            return;
        }

        const relme = build(microformats, rels?.me);
        const pgp = build(microformats, rels?.pgpkey);
        const feeds = build(microformats, rels?.alternate);
        const webmention = build(microformats, rels?.webmention);

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

const build = (
    microformats: ParsedDocument,
    links: string[] | null | undefined
): RelLink[] | null => {
    if (links == null || links.length === 0) return null;
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
