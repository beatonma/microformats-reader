import { compatBrowser } from "ts/compat";
import { Message, MessageRequest, MessageResponse } from "ts/message";
import { noneOf } from "ts/data/util/arrays";
import { ActiveState, EmptyState } from "ts/ui/browser/toolbar";
import { parse, MicroformatData } from "ts/data/parsing";
import { init } from "ts/index";

init();

const microformats = parse(document.documentElement.innerHTML, document.URL);

compatBrowser.runtime.onMessage.addListener(
    (
        request: MessageRequest,
        sender,
        sendResponse: (response: MessageResponse) => void,
    ) => {
        if (request.action === Message.getDocument) {
            sendResponse({
                html: document.documentElement.innerHTML,
                baseUrl: document.URL,
            });
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
