import { compatBrowser } from "ts/compat";
import { parseHCards } from "ts/data/parsing/h-card";
import { parseHFeeds } from "ts/data/parsing/h-feed";
import { parseRelatedLinks } from "ts/data/parsing/related-links";
import { TODO } from "ts/dev";
import { PopupProps } from "ts/entrypoint/popup/popup";
import { Message, MessageRequest, MessageResponse } from "ts/message";
import { noneOf } from "ts/data/util/arrays";
import { ActiveState, EmptyState } from "ts/ui/browser/toolbar";
import { parse, MicroformatData } from "ts/data/parsing";

const microformats = parse(document.documentElement.innerHTML, document.URL);

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

microformats.then((value: MicroformatData) => {
    const { relLinks, hcards, feeds } = value;

    const isEmpty = noneOf([relLinks, hcards, feeds]);
    const state = isEmpty ? EmptyState : ActiveState;

    void compatBrowser.runtime.sendMessage({
        action: Message.showBadge,
        state: state,
    });
});
