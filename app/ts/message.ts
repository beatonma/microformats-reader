export enum Message {
    getMicroformats = "get-microformats",
}

export interface MessageRequest {
    action: Message;
}
