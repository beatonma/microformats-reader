import React, {useEffect, useState} from "react";
import {createRoot} from "react-dom/client";
import {ParsedDocument} from "microformats-parser/dist/types";
import {HorizontalAlignment, Row} from "ts/components/layout";
import {Feeds, HCard, MicroformatsRaw, PgpKey, RelmeLinks, WebmentionEndpoint,} from "ts/components/microformats";
import {HFeed} from "ts/components/microformats/h-feed/h-feed";
import {parseHCards} from "ts/data/h-card";
import {parseHFeeds} from "ts/data/h-feed";
import {parseRelLinks, RelLinks} from "ts/data/related-links";
import {HCardData} from "ts/data/types";
import {HFeedData} from "ts/data/types/h-feed";
import {SampleData} from "ts/dev/sampledata";
import "ts/entrypoint/popup.scss";

const PopupUI = () => {
    const [microformats, setMicroformats] = useState<ParsedDocument | null>(
        null
    );
    const [relLinks, setRelLinks] = useState<RelLinks | null>(null);
    const [hcards, setHCards] = useState<HCardData[] | null>(null);
    const [feeds, setFeeds] = useState<HFeedData[] | null>(null);

    useEffect(() => {
        const data = SampleData;
        setMicroformats(data);

        parseRelLinks(data).then(setRelLinks);
        parseHCards(data).then(setHCards);
        parseHFeeds(data).then(setFeeds);
    }, []);

    // useEffect(() => {
    //     compatBrowser.tabs
    //         .query({ active: true, lastFocusedWindow: true })
    //         .then(tabs => {
    //             const currentTab = tabs[0];
    //
    //             compatBrowser.tabs
    //                 .sendMessage(currentTab.id, {
    //                     action: Message.getMicroformats,
    //                 })
    //                 .then((response: MessageResponse) => {
    //                     const data = response.microformats;
    //                     setMicroformats(data);
    //
    //                     setRelLinks(parseRelLinks(data));
    //                 });
    //         });
    // }, []);

    return (
        <>
            <Row alignment={HorizontalAlignment.Center} id="quick_links">
                <Feeds links={relLinks?.feeds ?? []} />
                <WebmentionEndpoint links={relLinks?.webmention ?? []} />
                <PgpKey links={relLinks?.pgp ?? []} />
            </Row>

            <div className="h-cards">
                {hcards?.map(hcard => (
                    <HCard {...hcard} key={hcard.id} />
                ))}
            </div>

            <div className="h-feeds">
                {feeds?.map((feed, index) => (
                    <HFeed data={feed} key={index} />
                ))}
            </div>

            <RelmeLinks links={relLinks?.relme ?? []} />
            <MicroformatsRaw microformats={microformats} />
        </>
    );
};

const container = document?.getElementById("container");
if (container) {
    const root = createRoot(container);
    root.render(<PopupUI />);
}
