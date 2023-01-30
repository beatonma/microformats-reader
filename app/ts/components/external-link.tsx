import React, { HTMLProps } from "react";

export const ExternalLink = (props: HTMLProps<HTMLAnchorElement>) => (
    <a
        {...props}
        onClick={() => chrome.tabs.create({ active: true, url: props.href })}
    />
);
