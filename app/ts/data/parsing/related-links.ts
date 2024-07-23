import { ParsedDocument } from "@microformats-parser";
import { RelLink, RelatedLinks } from "ts/data/types/rel";
import { anyOf, noneOf } from "ts/data/util/arrays";

export const parseRelatedLinks = async (
    microformats: ParsedDocument,
): Promise<RelatedLinks | null> => {
    const rels = microformats?.rels ?? null;
    if (rels == null) return null;

    const relme = build(microformats, rels.me);
    const pgp = build(microformats, rels.pgpkey);
    const search = build(microformats, rels.search);
    const webmention = build(microformats, rels.webmention);

    const atom = build(microformats, rels.alternate, "application/atom+xml");
    const rss = build(microformats, rels.alternate, "application/rss+xml");

    const consumedUrls = [...(rss ?? []), ...(atom ?? [])].map(it => it.href);
    const alternate =
        build(microformats, rels.alternate)?.filter(
            it => !consumedUrls?.includes(it.href),
        ) ?? null;

    if (noneOf([relme, pgp, rss, atom, alternate, webmention, search])) {
        return null;
    } else {
        const feeds = anyOf([rss, atom]) ? { rss: rss, atom: atom } : null;
        return {
            alternate: alternate,
            feeds: feeds,
            pgp: pgp,
            relme: relme,
            search: search,
            webmention: webmention,
        };
    }
};

const build = (
    microformats: ParsedDocument,
    links: string[] | null | undefined,
    typeFilter?: string,
): RelLink[] | null => {
    if (links == null || links.length === 0) return null;
    return links
        .map(url => {
            const rel = { ...microformats["rel-urls"][url] };
            rel.url = url.trim();
            rel.text = rel.text?.trim();
            rel.title = rel.title?.trim();
            rel.type = rel.type?.trim();
            rel.hreflang = rel.hreflang?.trim();
            return rel;
        })
        .filter(it => (typeFilter ? it.type === typeFilter : true))
        .map(rel => ({
            href: rel.url,
            text: rel.text ?? rel.title ?? rel.url,
            title: rel.title ?? rel.url,
            type: rel.type ?? null,
            lang: rel.hreflang ?? null,
        }))
        .sort((a: RelLink, b: RelLink) => a.text.localeCompare(b.text));
};
