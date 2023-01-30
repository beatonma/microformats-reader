import { mf2 } from "microformats-parser";
import { Message, MessageRequest, MessageResponse } from "./message";
import { ParsedDocument } from "microformats-parser/dist/types";
import { compatBrowser } from "./compat";

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
