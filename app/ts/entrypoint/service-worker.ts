import { compatBrowser } from "ts/compat";
import { Message, UpdateBadgeMessage } from "ts/message";
import { applyToolbarIconState } from "ts/ui/browser/toolbar";

compatBrowser.runtime.onMessage.addListener(
    (message: UpdateBadgeMessage, sender, sendResponse) => {
        if (message.action === Message.showBadge) {
            void applyToolbarIconState(message.state, sender.tab?.id);
            return true;
        }
        return false;
    },
);
