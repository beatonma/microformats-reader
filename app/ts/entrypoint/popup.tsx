import React, { useEffect, useState } from "react";
import { ParsedDocument } from "microformats-parser/dist/types";
import { _, compatBrowser } from "ts/compat";
import { parseHCards } from "ts/data/parsing/h-card";
import { parseHFeeds } from "ts/data/parsing/h-feed";
import { parseRelatedLinks } from "ts/data/parsing/related-links";
import { HCardData } from "ts/data/types";
import { HFeedData } from "ts/data/types/h-feed";
import { RelatedLinks } from "ts/data/types/rel";
import { noneOf } from "ts/data/util/arrays";
import { initEntrypointUi } from "ts/entrypoint/init-entrypoint-ui";
import { Message, MessageResponse } from "ts/message";
import { formatUri } from "ts/ui/formatting";
import { HorizontalAlignment, Row } from "ts/ui/layout";
import { ScrimLayout } from "ts/ui/layout/dialog";
import {
    Feeds,
    HCard,
    PgpKey,
    RelmeLinks,
    WebmentionEndpoint,
} from "ts/ui/microformats";
import { HFeed } from "ts/ui/microformats/h-feed/h-feed";
import { PropsOf } from "ts/ui/props";
import { injectTheme } from "ts/ui/theme";
import "./popup.scss";

export const parseDocument = (
    microformats: ParsedDocument | null
): PopupProps => {
    const [relLinks, setRelLinks] = useState<RelatedLinks | null>(null);
    const [hcards, setHCards] = useState<HCardData[] | null>(null);
    const [feeds, setFeeds] = useState<HFeedData[] | null>(null);

    useEffect(() => {
        if (!microformats) return;
        parseRelatedLinks(microformats).then(setRelLinks);
        parseHCards(microformats).then(setHCards);
        parseHFeeds(microformats).then(setFeeds);

        injectTheme(null);
    }, [microformats]);

    return {
        relLinks: relLinks,
        hcards: hcards,
        feeds: feeds,
    };
};

export interface PopupProps {
    relLinks: RelatedLinks | null;
    hcards: HCardData[] | null;
    feeds: HFeedData[] | null;
}
export const PopupUI = (props: PopupProps) => {
    const { relLinks, hcards, feeds } = props;

    if (noneOf([relLinks, hcards, feeds])) {
        return <NoContent />;
    }

    return (
        <ScrimLayout>
            <main>
                <section id="quick_links">
                    <QuickLinks data={relLinks} />
                </section>

                <section id="h_cards">
                    {hcards?.map(hcard => (
                        <HCard {...hcard} key={hcard.id} />
                    ))}
                </section>

                <section id="h_feeds">
                    {feeds?.map((feed, index) => (
                        <HFeed data={feed} key={index} />
                    ))}
                </section>

                <section id="rel_me">
                    <RelmeLinks links={relLinks?.relme} />
                </section>
            </main>
        </ScrimLayout>
    );
};

const NoContent = () => (
    <div id="no_content">
        <p>{_("no_microformat_content")}</p>
        <p>
            <a href={document.location.href}>
                {formatUri(document.location.href)}
            </a>
        </p>
    </div>
);

const Popup = () => {
    const microformats = getMicroformatsFromCurrentTab();
    return <PopupUI {...microformats} />;
};

const QuickLinks = (props: PropsOf<RelatedLinks>) => {
    const { data } = props;

    if (!data) return null;

    return (
        <Row alignment={HorizontalAlignment.Center}>
            <Feeds links={data.feeds} />
            <WebmentionEndpoint links={data.webmention} />
            <PgpKey links={data.pgp} />
        </Row>
    );
};

const getMicroformatsFromCurrentTab = (): PopupProps => {
    const [microformats, setMicroformats] = useState<ParsedDocument | null>(
        null
    );

    useEffect(() => {
        compatBrowser.tabs
            .query({ active: true, lastFocusedWindow: true })
            .then(tabs => {
                const currentTab = tabs[0];
                compatBrowser.tabs
                    .sendMessage(currentTab.id, {
                        action: Message.getMicroformats,
                    })
                    .then((response: MessageResponse) => {
                        setMicroformats(response.microformats);
                    });
            });
    }, []);

    return parseDocument(microformats);
};

initEntrypointUi("extension_name", "container", <Popup />);
