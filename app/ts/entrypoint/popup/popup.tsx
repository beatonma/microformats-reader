import React, { useContext, useEffect, useRef, useState } from "react";
import { ParsedDocument } from "@microformats-parser";
import { _, compatBrowser } from "ts/compat";
import { HCardData } from "ts/data/types";
import { HFeedData } from "ts/data/types/h-feed";
import { RelatedLinks } from "ts/data/types/rel";
import { noneOf } from "ts/data/util/arrays";
import { Message, MessageResponse } from "ts/message";
import { Alignment, Row } from "ts/ui/layout";
import { ScrimLayout } from "ts/ui/layout/dialog";
import {
    Feeds,
    HCard,
    PgpKey,
    RelmeLinks,
    WebmentionEndpoint,
} from "ts/ui/microformats";
import { HFeed } from "ts/ui/microformats/h-feed/h-feed";
import { NullablePropsOf } from "ts/ui/props";
import { injectTheme } from "ts/ui/theme";
import "ts/entrypoint/popup/popup.scss";
import { Loading } from "ts/ui/loading";
import { Error } from "ts/ui/error";
import { OptionsContext, PopupSection, useOptions } from "ts/options";
import { onlyIf } from "ts/data/util";

export interface PopupProps {
    microformats: ParsedDocument;
    relLinks: RelatedLinks | null;
    hcards: HCardData[] | null;
    feeds: HFeedData[] | null;
}
export const PopupUI = (props: PopupProps) => {
    const { relLinks, hcards, feeds } = props;
    const isEmpty = noneOf([relLinks, hcards, feeds]);
    const options = useContext(OptionsContext);
    const sections = options.popupContents;

    if (isEmpty) {
        return <NoContent />;
    }

    return (
        <ScrimLayout>
            <main>
                <section id="quick_links">
                    <QuickLinks data={relLinks} />
                </section>

                {onlyIf(sections.includes(PopupSection["h-card"]), () => (
                    <section id="h_cards">
                        {hcards?.map(hcard => (
                            <HCard {...hcard} key={hcard.id} />
                        ))}
                    </section>
                ))}

                {onlyIf(sections.includes(PopupSection["h-feed"]), () => (
                    <section id="h_feeds">
                        {feeds?.map((feed, index) => (
                            <HFeed data={feed} key={index} />
                        ))}
                    </section>
                ))}

                {onlyIf(sections.includes(PopupSection["relme"]), () => (
                    <section id="rel_me">
                        <RelmeLinks links={relLinks?.relme} />
                    </section>
                ))}
            </main>
        </ScrimLayout>
    );
};

const NoContent = () => (
    <div id="no_content">
        <p>{_("no_microformat_content")}</p>
    </div>
);

export const Popup = () => {
    const microformats = getMicroformatsFromCurrentTab();
    const [options] = useOptions();

    if (microformats === undefined) return <Loading />;
    if (options === undefined) return <Loading />;
    if (microformats === null)
        return <Error message={_("error_loading_failed")} />;

    return (
        <OptionsContext.Provider value={options}>
            <PopupUI {...microformats} />
        </OptionsContext.Provider>
    );
};

const QuickLinks = (props: NullablePropsOf<RelatedLinks>) => {
    const { data } = props;

    if (!data) return null;

    return (
        <Row horizontal={Alignment.Center}>
            <Feeds feeds={data.feeds} />
            <WebmentionEndpoint links={data.webmention} />
            <PgpKey links={data.pgp} />
        </Row>
    );
};

const getMicroformatsFromCurrentTab = (): PopupProps | null | undefined => {
    const [props, setProps] = useState<PopupProps | null | undefined>();
    const [retryFlag, setRetryFlag] = useState<boolean>(false);
    const retryTimestamp = useRef(performance.now());

    useEffect(() => {
        const now = performance.now();
        if (now - retryTimestamp.current > 2000) {
            console.warn(
                "Microformat loading failed: timeout exceeded. Please try reloading the tab.",
            );
            setProps(null);
            return;
        }
        compatBrowser.tabs.currentTab().then(currentTab => {
            if (currentTab == null) {
                console.debug("currentTab is null");
                return;
            }

            compatBrowser.tabs
                .sendMessage(currentTab.id, {
                    action: Message.getMicroformats,
                })
                .then((response: MessageResponse) => {
                    setProps(response);
                    injectTheme(null);
                })
                .catch(e => setRetryFlag(it => !it));
        });
    }, [retryFlag]);

    return props;
};
