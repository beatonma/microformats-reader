import { ParsedDocument } from "microformats-parser/dist/types";

export interface RelLink {
    href: string;
    text?: string;
    title?: string;
    type?: string;
}

export interface RelLinks {
    relme: RelLink[];
    pgp: RelLink[];
    feeds: RelLink[];
    webmention: RelLink[];
}

export function parseRelLinks(microformats: ParsedDocument): RelLinks | null {
    const rels = microformats?.rels ?? null;
    if (rels == null) return null;

    const relmeLinks = rels?.me ?? [];
    const pgpLinks = rels?.pgpkey ?? [];
    const feedLinks = rels?.alternate ?? [];
    const webmentionEndpoints = rels?.webmention ?? [];

    function build(links: string[]) {
        return links
            .map(url => {
                const rel = microformats["rel-urls"][url];
                return {
                    href: url,
                    text: rel.text?.trim() ?? rel.title?.trim() ?? url,
                    title: rel.title?.trim(),
                    type: rel.type?.trim(),
                };
            })
            .sort((a: RelLink, b: RelLink) => a.text.localeCompare(b.text));
    }

    return {
        relme: build(relmeLinks),
        pgp: build(pgpLinks),
        feeds: build(feedLinks),
        webmention: build(webmentionEndpoints),
    };
}
