import { PopupProps } from "ts/entrypoint/popup";
import { ToolbarIconState } from "ts/ui/browser/toolbar";

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

export type MessageResponse = PopupProps;
