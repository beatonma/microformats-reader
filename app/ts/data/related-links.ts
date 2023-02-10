import {ParsedDocument} from "microformats-parser/dist/types";

export interface RelLink {
    href: string;
    text: string;
    title: string;
    type: string | null;
}

export interface RelLinks {
    relme: RelLink[];
    pgp: RelLink[];
    feeds: RelLink[];
    webmention: RelLink[];
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

        const build = (links: string[]): RelLink[] =>
            links
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

        resolve({
            relme: build(relmeLinks),
            pgp: build(pgpLinks),
            feeds: build(feedLinks),
            webmention: build(webmentionEndpoints),
        });
    });
