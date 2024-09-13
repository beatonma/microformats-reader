import { ToolbarIconState } from "ts/ui/browser/toolbar";

export enum Message {
    showBadge = "show-badge",
    getDocument = "get-document",
}

export interface MessageRequest {
    action: Message;
}

export interface UpdateBadgeMessage extends MessageRequest {
    action: Message.showBadge;
    state: ToolbarIconState;
}

export interface MessageResponse {
    html: string;
    baseUrl: string;
}
