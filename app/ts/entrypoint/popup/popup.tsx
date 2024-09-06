import React, {
    MouseEvent,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { _, compatBrowser } from "ts/compat";
import { noneOf } from "ts/data/util/arrays";
import { Message, MessageResponse } from "ts/message";
import { ScrimLayout } from "ts/ui/layout/dialog";
import { HAdr, HCard, HFeed } from "ts/ui/microformats";
import { injectTheme } from "ts/ui/theme";
import { Loading } from "ts/ui/loading";
import { Error } from "ts/ui/error";
import { OptionsContext, useOptions } from "ts/options";
import { MicroformatData, parse } from "ts/data/parsing";
import { copyToClipboard } from "ts/ui/actions/clipboard";
import { Microformat } from "ts/data/microformats";
import HEvent from "ts/ui/microformats/h-event";
import { ConditionalContent } from "ts/ui/layout/conditional";
import { QuickLinks, RelatedLinks } from "ts/ui/microformats/rel";
import "./popup.scss";

export const PopupUI = (props: MicroformatData) => {
    const { relLinks, hcards, feeds, locations, events } = props;
    const isEmpty = noneOf([relLinks, hcards, feeds]);
    const options = useContext(OptionsContext);
    const sections = options.popupContents;

    if (isEmpty) {
        return <NoContent />;
    }

    return (
        <ScrimLayout>
            <main
                onContextMenu={(e: MouseEvent) => {
                    if (e.ctrlKey) {
                        e.preventDefault();
                        e.stopPropagation();
                        copyToClipboard(JSON.stringify(props, null, 2));
                    }
                }}
            >
                <section id="quick_links">
                    <QuickLinks data={relLinks} />
                </section>

                <ConditionalContent condition={sections["h-card"]}>
                    <section id="h_cards">
                        {hcards?.map(hcard => (
                            <HCard {...hcard} key={hcard.id} />
                        ))}
                    </section>
                </ConditionalContent>

                <ConditionalContent condition={sections["h-feed"]}>
                    <section id="h_feeds">
                        {feeds?.map((feed, index) => (
                            <HFeed data={feed} key={index} />
                        ))}
                    </section>
                </ConditionalContent>

                <ConditionalContent condition={sections["h-event"]}>
                    <section id="h_events">
                        {events?.map((event, index) => (
                            <HEvent data={event} key={index} />
                        ))}
                    </section>
                </ConditionalContent>

                <ConditionalContent condition={sections["h-adr"]}>
                    <section id="locations">
                        {locations.adrs?.map((location, index) => (
                            <HAdr
                                microformat={Microformat.H.Adr}
                                location={location}
                                key={index}
                            />
                        ))}

                        {locations.geos?.map((location, index) => (
                            <HAdr
                                microformat={Microformat.H.Geo}
                                location={location}
                                key={index}
                            />
                        ))}
                    </section>
                </ConditionalContent>

                <ConditionalContent condition={sections["rel=me"]}>
                    <section id="rel_me">
                        <RelatedLinks data={relLinks} />
                    </section>
                </ConditionalContent>
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

    if (microformats === undefined)
        return <Loading reason="microformats === undefined" />;
    if (options === undefined)
        return <Loading reason="options === undefined" />;
    if (microformats === null)
        return <Error message={_("error_loading_failed")} />;

    return (
        <OptionsContext.Provider value={options}>
            <PopupUI {...microformats} />
        </OptionsContext.Provider>
    );
};

const getMicroformatsFromCurrentTab = ():
    | MicroformatData
    | null
    | undefined => {
    const [data, setData] = useState<MicroformatData | null | undefined>();
    const [retryFlag, setRetryFlag] = useState<boolean>(false);
    const retryTimestamp = useRef(performance.now());

    useEffect(() => {
        const now = performance.now();
        if (now - retryTimestamp.current > 2000) {
            console.warn(
                "Microformat loading failed: timeout exceeded. Please try reloading the tab.",
            );
            setData(null);
            return;
        }
        compatBrowser.tabs.currentTab().then(currentTab => {
            if (currentTab == null) {
                console.debug("currentTab is null");
                return;
            }

            compatBrowser.tabs
                .sendMessage(currentTab.id, {
                    action: Message.getDocument,
                })
                .then((response: MessageResponse) =>
                    parse(response.html, response.baseUrl),
                )
                .then(data => {
                    setData(data);
                    injectTheme(null);
                })
                .catch(e => setRetryFlag(it => !it));
        });
    }, [retryFlag]);

    return data;
};
