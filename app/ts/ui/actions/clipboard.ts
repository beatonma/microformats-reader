import React from "react";
import { formatDateTime } from "ts/ui/formatting/time";

export const copyToClipboard = (content: any): Promise<void> | null => {
    if (content == null) return null;

    if (
        ["string", "number", "boolean"].includes(typeof content) ||
        React.isValidElement(content)
    ) {
        return copyText(content.toString());
    }

    if (content instanceof Date) {
        return copyText(formatDateTime(content));
    }

    return copyText(JSON.stringify(content, null, 2));
};

const copyText = (content: string | null): Promise<void> | null => {
    if (content == null) return null;
    console.log(`Copied to clipboard: '${content}'`);
    return navigator.clipboard.writeText(content);
};
