import React, { useEffect, useState } from "react";
import { ParsedDocument } from "@microformats-parser";
import { _, compatBrowser } from "ts/compat";
import { HCardData } from "ts/data/types";
import { HFeedData } from "ts/data/types/h-feed";
import { RelatedLinks } from "ts/data/types/rel";
import { noneOf } from "ts/data/util/arrays";
import { initEntrypointUi } from "ts/entrypoint/init-entrypoint-ui";
import { Message, MessageResponse } from "ts/message";
import {
    ActiveState,
    EmptyState,
    applyToolbarIconState,
} from "ts/ui/browser/toolbar";
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

export interface PopupProps {
    microformats: ParsedDocument;
    relLinks: RelatedLinks | null;
    hcards: HCardData[] | null;
    feeds: HFeedData[] | null;
}
export const PopupUI = (props: PopupProps) => {
    const { relLinks, hcards, feeds } = props;
    const isEmpty = noneOf([relLinks, hcards, feeds]);

    useEffect(() => {
        updateToolbarIcon(isEmpty);
    }, [isEmpty]);

    if (isEmpty) {
        return <NoContent />;
    }

    return (
        <ScrimLayout>
            <main>
                <section id="quick_links">
                    <QuickLinks data={relLinks} />
                </section>

                <section id="h_cards">
                    {hcards?.map(hcard => <HCard {...hcard} key={hcard.id} />)}
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

    if (microformats == null) return null;

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

const getMicroformatsFromCurrentTab = (): PopupProps | undefined => {
    const [props, setProps] = useState<PopupProps>();

    useEffect(() => {
        compatBrowser.tabs.currentTab().then(currentTab => {
            if (currentTab == null) return;

            compatBrowser.tabs
                .sendMessage(currentTab.id, {
                    action: Message.getMicroformats,
                })
                .then((response: MessageResponse) => {
                    setProps(response);
                    injectTheme(null);
                });
        });
    }, []);

    return props;
};

const updateToolbarIcon = (isEmpty: boolean) => {
    const state = isEmpty ? EmptyState : ActiveState;
    return applyToolbarIconState(state);
};

initEntrypointUi("extension_name", "container", <Popup />);
