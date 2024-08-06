import { mf2 } from "microformats-parser";
import { ParsedDocument } from "@microformats-parser";
import { compatBrowser } from "ts/compat";
import { parseHCards } from "ts/data/parsing/h-card";
import { parseHFeeds } from "ts/data/parsing/h-feed";
import { parseRelatedLinks } from "ts/data/parsing/related-links";
import { TODO } from "ts/dev";
import { PopupProps } from "ts/entrypoint/popup/popup";
import { Message, MessageRequest, MessageResponse } from "ts/message";
import { noneOf } from "ts/data/util/arrays";
import { ActiveState, EmptyState } from "ts/ui/browser/toolbar";

export const loadMicroformats = (
    html: string = document.documentElement.innerHTML,
    baseUrl: string = document.URL,
) => {
    return mf2(html, {
        baseUrl: baseUrl,
        experimental: {
            lang: true,
            textContent: true,
        },
    });
};

export const parseDocument = async (
    parsed: ParsedDocument = loadMicroformats(),
): Promise<PopupProps> => {
    const relatedLinks = await parseRelatedLinks(parsed);
    const hcards = await parseHCards(parsed);
    const hfeeds = await parseHFeeds(parsed);

    return {
        microformats: parsed,
        relLinks: relatedLinks,
        hcards: hcards,
        feeds: hfeeds,
    };
};

compatBrowser.runtime.onMessage.addListener(
    (
        request: MessageRequest,
        sender,
        sendResponse: (response: MessageResponse) => void,
    ) => {
        if (request.action === Message.getMicroformats) {
            microformats.then(sendResponse);
            return true;
        }
        return false;
    },
);

const microformats = parseDocument();

microformats.then(value => {
    const { relLinks, hcards, feeds } = value;

    const isEmpty = noneOf([relLinks, hcards, feeds]);
    const state = isEmpty ? EmptyState : ActiveState;

    void compatBrowser.runtime.sendMessage({
        action: Message.showBadge,
        state: state,
    });
});

TODO(
    "Get colors from theme and/or use `vibrant` on photo/logo: https://github.com/Vibrant-Colors/node-vibrant",
);
