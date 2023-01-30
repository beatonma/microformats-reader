import React, { HTMLProps } from "react";

export const ExternalLink = (props: HTMLProps<HTMLAnchorElement>) => {
    const { title, href, ...rest } = props;
    const titleWithURL = [title, href].join("\n");

    return (
        <a
            href={href}
            title={titleWithURL}
            onClick={() => chrome.tabs.create({ active: true, url: href })}
            {...rest}
        />
    );
};
