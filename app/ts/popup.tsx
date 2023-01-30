import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./popup.scss";
import { Message, MessageResponse } from "./message";
import { compatBrowser } from "./compat";
import {
    Feeds,
    PgpKey,
    RelmeLinks,
    WebmentionEndpoint,
} from "./components/microformats/rel";
import { parseRelLinks, RelLinks } from "./components/microformats/parsing";
import { MicroformatsRaw } from "./components/microformats/raw";
import { Row, HorizontalAlignment } from "./components/layout";

const PopupUI = () => {
    const [microformats, setMicroformats] = useState(null);
    const [relLinks, setRelLinks] = useState<RelLinks>(null);

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
        <div>
            <Row alignment={HorizontalAlignment.Center} id="quick_links">
                <WebmentionEndpoint links={relLinks?.webmention} />
                <Feeds links={relLinks?.feeds} />
                <PgpKey links={relLinks?.pgp} />
            </Row>
            <RelmeLinks links={relLinks?.relme} />
            <MicroformatsRaw microformats={microformats} />
        </div>
    );
};

const root = createRoot(document.getElementById("container"));
root.render(<PopupUI />);
