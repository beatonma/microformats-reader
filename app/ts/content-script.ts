import { Message, MessageRequest } from "./message";

const WebmentionEndpointRegex =
    /<(a|link) (?=.*?rel="webmention").*?href="(.*?)".*?>/;

chrome.runtime.onMessage.addListener(
    (request: MessageRequest, sender, sendResponse) => {
        if (request.action === Message.getMicroformats) {
            const webmentionsEndpoint = getWebmentionEndpoint(
                document.documentElement
            );

            // TODO
        }
    }
);

export function getWebmentionEndpoint(
    element: Element | string
): string | null {
    const html: string =
        element instanceof Element ? element.innerHTML : element;

    const matches = html.match(WebmentionEndpointRegex);
    return matches?.[2] ?? null;
}
