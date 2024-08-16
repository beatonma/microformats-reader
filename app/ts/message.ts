import { ToolbarIconState } from "ts/ui/browser/toolbar";
import { MicroformatData } from "ts/data/parsing";

export enum Message {
    getMicroformats = "get-microformats",
    showBadge = "show-badge",
}

export interface MessageRequest {
    action: Message;
}

export interface UpdateBadgeMessage extends MessageRequest {
    action: Message.showBadge;
    state: ToolbarIconState;
}

export type MessageResponse = MicroformatData;
