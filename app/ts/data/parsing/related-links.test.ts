import { describe, expect, test } from "@jest/globals";
import { parseRelatedLinks } from "ts/data/parsing/related-links";
import { RelLink } from "ts/data/types/rel";

const sampleRelsDocument = {
    rels: {
        canonical: ["https://www.sample.org/"],
        search: [
            "https://www.sample.org/opensearch.xml",
            "https://www.sample.org/search",
        ],
        alternate: [
            "https://www.sample.org/rss.xml",
            "https://www.sample.org/atom.xml",
            "gemini://sample.org/",
        ],
        webmention: ["https://sample.org/webmention"],
        micropub: ["https://indiekit.last.pub/micropub"],
        me: [
            "mailto:sample@sample.org",
            "https://bsky.app/profile/sample.org",
            "https://github.com/sample.org",
            "https://id.sample.org",
            "https://sample.org",
        ],
        pgpkey: ["https://sample.org/pgp"],
    },
    "rel-urls": {
        "https://www.sample.org/": {
            rels: ["canonical"],
            text: "",
        },
        "https://www.sample.org/opensearch.xml": {
            rels: ["search"],
            text: "",
            title: "sample.org",
            type: "application/opensearchdescription+xml",
        },
        "https://www.sample.org/search": {
            rels: ["search"],
            text: "",
            title: "sample.org",
            type: "application/pagefind",
        },
        "https://www.sample.org/rss.xml": {
            rels: ["alternate"],
            text: "",
            title: "sample.org (RSS)",
            type: "application/rss+xml",
        },
        "https://www.sample.org/atom.xml": {
            rels: ["alternate"],
            text: "",
            title: "sample.org (Atom)",
            type: "application/atom+xml",
        },
        "gemini://sample.org/": {
            rels: ["alternate"],
            text: "",
            title: "sample.org (Gemini)",
            type: "text/gemini",
        },
        "https://sample.org/webmention": {
            rels: ["webmention"],
            text: "",
        },
        "https://indiekit.last.pub/auth": {
            rels: ["authorization_endpoint"],
            text: "",
        },
        "https://indiekit.last.pub/auth/token": {
            rels: ["token_endpoint"],
            text: "",
        },
        "https://indiekit.last.pub/.well-known/oauth-authorization-server": {
            rels: ["indieauth-metadata"],
            text: "",
        },
        "https://indiekit.last.pub/micropub": {
            rels: ["micropub"],
            text: "",
        },
        "mailto:sample@sample.org": {
            rels: ["me"],
            text: "",
            title: "Email",
        },
        "https://bsky.app/profile/sample.org": {
            rels: ["me"],
            text: "",
            title: "Bluesky",
        },
        "https://github.com/sample.org": {
            rels: ["me"],
            text: "",
            title: "Github",
        },
        "https://id.sample.org": {
            rels: ["me"],
            text: "",
            title: "Keyoxide",
        },
        "https://sample.org/pgp": {
            rels: ["authn", "pgpkey"],
            text: "",
            title: "Gpg",
        },
    },
    items: [],
};

const parsed = parseRelatedLinks(sampleRelsDocument);
const hrefsOf = (rels: RelLink[] | null | undefined): string[] => {
    return rels!.map(it => it.href);
};

describe("rel links parsing", () => {
    test("rel=me", async () => {
        const relme = await parsed.then(data => data!.relme);

        [
            ["Github", "https://github.com/sample.org"],
            ["Bluesky", "https://bsky.app/profile/sample.org"],
        ].forEach(([name, url]) => {
            expect(relme!.find(it => it.href === url)!.title).toBe(name);
        });
    });

    test("webmention", async () => {
        const webmention = await parsed.then(data => data?.webmention);

        expect(hrefsOf(webmention)).toEqual(["https://sample.org/webmention"]);
    });

    test("rss + atom", async () => {
        const rss = await parsed.then(data => data?.feeds?.rss);
        const atom = await parsed.then(data => data?.feeds?.atom);

        expect(hrefsOf(rss)).toEqual(["https://www.sample.org/rss.xml"]);
        expect(hrefsOf(atom)).toEqual(["https://www.sample.org/atom.xml"]);
    });

    test("alternates", async () => {
        const alt = await parsed.then(data => data?.alternate);

        expect(hrefsOf(alt)).toEqual(["gemini://sample.org/"]);
    });

    test("search", async () => {
        const search = await parsed.then(data => data?.search);

        expect(hrefsOf(search)).toEqual([
            "https://www.sample.org/opensearch.xml",
            "https://www.sample.org/search",
        ]);
    });
});
