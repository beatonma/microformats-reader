import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./popup.scss";
import { Message, MessageResponse } from "./message";
import { compatBrowser } from "../static/compat/compat";
import { ParsedDocument } from "microformats-parser/dist/types";
import { Dropdown } from "./components";

const PopupUI = () => {
    const [webmentionEndpoint, setWebmentionEndpoint] = useState(null);
    const [microformats, setMicroformats] = useState(null);
    const [tabUrl, setTabUrl] = useState(null);

    useEffect(() => {
        compatBrowser.tabs
            .query({ active: true, lastFocusedWindow: true })
            .then(tabs => {
                const currentTab = tabs[0];
                setTabUrl(currentTab.url);
                console.log(currentTab);

                compatBrowser.tabs
                    .sendMessage(currentTab.id, {
                        action: Message.getMicroformats,
                    })
                    .then((response: MessageResponse) => {
                        setWebmentionEndpoint(response.webmentionEndpoint);
                        setMicroformats(response.microformats);
                    });
            });
    }, []);

    return (
        <div>
            <WebmentionEndpoint url={webmentionEndpoint} />
            <RelmeLinks urls={microformats?.rels?.me ?? []} />
            <MicroformatsRaw microformats={microformats} />
        </div>
    );
};

interface UrlsProps {
    urls: string[];
}
const RelmeLinks = (props: UrlsProps) => {
    const { urls } = props;
    return (
        <Dropdown header={"rel=me"}>
            {urls.map(url => (
                <div>
                    <a href={url}>{url}</a>
                </div>
            ))}
        </Dropdown>
    );
};

interface UrlProps {
    url: string;
}
const WebmentionEndpoint = (props: UrlProps) => {
    const { url } = props;

    if (url === null) {
        return null;
    }

    return (
        <div>
            <a href={url} title={url}>
                Webmention endpoint
            </a>
        </div>
    );
};

interface MicroformatsProps {
    microformats: ParsedDocument;
}
const MicroformatsRaw = (props: MicroformatsProps) => {
    const { microformats } = props;
    return (
        <div>
            Microformats:
            <pre>{`${JSON.stringify(microformats, null, 2)}`}</pre>
        </div>
    );
};

const root = createRoot(document.getElementById("container"));
root.render(<PopupUI />);
