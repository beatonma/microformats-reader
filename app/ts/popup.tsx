import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { compatBrowser } from "./compat";
import { HorizontalAlignment, Row } from "./components/layout";
import {
    Feeds,
    PgpKey,
    RelmeLinks,
    WebmentionEndpoint,
} from "./components/microformats";
import { MicroformatsRaw } from "./components/microformats";
import { HCard } from "./components/microformats";
import { HCardData, parseHCards } from "./data/h-card";
import { RelLinks, parseRelLinks } from "./data/related-links";
import { Message, MessageResponse } from "./message";
import { SampleData } from "./sampledata";
import "./popup.scss";

const PopupUI = () => {
    const [microformats, setMicroformats] = useState(null);
    const [relLinks, setRelLinks] = useState<RelLinks>(null);
    const [hcards, setHCards] = useState<HCardData[]>(null);

    useEffect(() => {
        const data = SampleData;
        setMicroformats(data);

        setRelLinks(parseRelLinks(data));
        setHCards(parseHCards(data));
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
        <div>
            <Row alignment={HorizontalAlignment.Center} id="quick_links">
                <WebmentionEndpoint links={relLinks?.webmention} />
                <Feeds links={relLinks?.feeds} />
                <PgpKey links={relLinks?.pgp} />
            </Row>
            <div className="h-cards">
                {hcards?.map(hcard => (
                    <HCard hcard={hcard} key={hcard.name ?? hcard.url} />
                    // <HCard hcard={hcard} key={hcard.url} />
                ))}
            </div>
            <RelmeLinks links={relLinks?.relme} />
            <MicroformatsRaw microformats={microformats} />
        </div>
    );
};

const root = createRoot(document.getElementById("container"));
root.render(<PopupUI />);
