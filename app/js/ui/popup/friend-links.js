class FriendLinks {
    constructor(microformats) {
        this.rels = getValueOr(microformats, "rels", {});
        this.relurls = getValueOr(microformats, "rel-urls", {});
    }

    build() {
        const card = new DivBuilder("card");
        const friends = getValueOr(this.rels, "friend", []);

        const sortableLinks = [];
        for (let i = 0; i < friends.length; i++) {
            const link = friends[i];
            sortableLinks.push(new SortableLink(link));
        }
        sortableLinks.sort(function (a, b) {
            return a.domain.localeCompare(b.domain);
        });

        for (let i = 0; i < sortableLinks.length; i++) {
            const link = sortableLinks[i];
            const metadata = this.relurls[link.url];

            const a = new DivBuilder("single-line");
            a.addPrefix(getIcon("svg_icon_link", "h-item-icon"));
            a.add(linkify(link.url, link.domain + link.path));
            const alt = getValueOr(
                metadata,
                "text",
                getValueOr(metadata, ["title"])
            );
            const rels = getValueOr(metadata, "rels", []).join("/");
            a.addSuffix(
                new SpanBuilder()
                    .add(alt)
                    .add(", ")
                    .add(rels)
                    .addPrefix(" (")
                    .addSuffix(")")
            );
            card.add(a);
        }

        card.addPrefix(
            new DivBuilder("h-section-label h-title").add(
                getMessage("section_friend_links")
            )
        );

        return card;
    }
}
