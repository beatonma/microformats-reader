import { mf2 } from "microformats-parser";
import { Message, MessageRequest, MessageResponse } from "./message";
import { ParsedDocument } from "microformats-parser/dist/types";
import { compatBrowser } from "../static/compat/compat";

const WebmentionEndpointRegex =
    /<(a|link) (?=.*?rel="webmention").*?href="(.*?)".*?>/;

export const getWebmentionEndpoint = (
    html: string,
    baseUrl: string
): string | null => {
    const matches = html.match(WebmentionEndpointRegex);
    const endpoint = matches?.[2] ?? null;
    if (endpoint === null) return null;
    return new URL(endpoint, baseUrl).href;
};

compatBrowser.runtime.onMessage.addListener(
    (
        request: MessageRequest,
        sender: any,
        sendResponse: (response?: MessageResponse) => void
    ) => {
        if (request.action === Message.getMicroformats) {
            const documentHtml = document.documentElement.innerHTML;
            const webmentionsEndpoint = getWebmentionEndpoint(
                documentHtml,
                document.URL
            );
            const microformats: ParsedDocument = mf2(documentHtml, {
                baseUrl: document.URL,
            });

            sendResponse({
                webmentionEndpoint: webmentionsEndpoint,
                microformats: microformats,
            });
        }
    }
);
