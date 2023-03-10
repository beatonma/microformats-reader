import { ParsedDocument } from "microformats-parser/dist/types";

export enum Message {
    getMicroformats = "get-microformats",
}

export interface MessageRequest {
    action: Message;
}

export interface MessageResponse {
    microformats?: ParsedDocument;
}
