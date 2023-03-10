import { PopupProps } from "ts/entrypoint/popup";

export enum Message {
    getMicroformats = "get-microformats",
}

export interface MessageRequest {
    action: Message;
}

export type MessageResponse = PopupProps;
