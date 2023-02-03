import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { compatBrowser } from "ts/compat";
import { HorizontalAlignment, Row } from "ts/components/layout";
import {
    Feeds,
    PgpKey,
    RelmeLinks,
    WebmentionEndpoint,
} from "ts/components/microformats";
import { MicroformatsRaw } from "ts/components/microformats";
import { HCard } from "ts/components/microformats";
import { HCardData, parseHCards } from "ts/data/h-card";
import { RelLinks, parseRelLinks } from "ts/data/related-links";
import { SampleData } from "ts/dev/sampledata";
import "ts/entrypoint/popup.scss";
import { Message, MessageResponse } from "ts/message";

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
                        const data = response.microformats;
                        setMicroformats(data);

                        setRelLinks(parseRelLinks(data));
                    });
            });
    }, []);

    return (
        <>
            <Row alignment={HorizontalAlignment.Center} id="quick_links">
                <Feeds links={relLinks?.feeds} />
                <WebmentionEndpoint links={relLinks?.webmention} />
                <PgpKey links={relLinks?.pgp} />
            </Row>
            <div className="h-cards">
                {hcards?.map(hcard => (
                    <HCard {...hcard} key={hcard.name ?? hcard.contact?.url} />
                ))}
            </div>
            <RelmeLinks links={relLinks?.relme} />
            <MicroformatsRaw microformats={microformats} />
        </>
    );
};

const root = createRoot(document.getElementById("container"));
root.render(<PopupUI />);
