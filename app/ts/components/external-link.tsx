import React, { HTMLProps } from "react";

export const ExternalLink = (props: HTMLProps<HTMLAnchorElement>) => {
    const { title, href, ...rest } = props;

    if (href?.startsWith("#")) {
        return <LinkToSection {...props} />;
    }

    const titleWithURL = [title, href].join("\n");
    const onClick = () => chrome.tabs.create({ active: true, url: href });

    return <a href={href} title={titleWithURL} onClick={onClick} {...rest} />;
};

const LinkToSection = (props: HTMLProps<HTMLAnchorElement>) => {
    const { title, href, ...rest } = props;

    return <a href={href} title={title} {...rest} />;
};
