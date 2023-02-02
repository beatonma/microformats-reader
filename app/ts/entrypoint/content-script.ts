import { mf2 } from "microformats-parser";
import { ParsedDocument } from "microformats-parser/dist/types";
import { compatBrowser } from "ts/compat";
import { TODO } from "ts/dev";
import { Message, MessageRequest, MessageResponse } from "ts/message";

compatBrowser.runtime.onMessage.addListener(
    (
        request: MessageRequest,
        sender: any,
        sendResponse: (response?: MessageResponse) => void
    ) => {
        if (request.action === Message.getMicroformats) {
            const documentHtml = document.documentElement.innerHTML;

            const microformats: ParsedDocument = mf2(documentHtml, {
                baseUrl: document.URL,
            });

            sendResponse({
                microformats: microformats,
            });
        }
    }
);

TODO(
    "Get colors from theme and/or use `vibrant` on photo/logo: https://github.com/Vibrant-Colors/node-vibrant"
);
