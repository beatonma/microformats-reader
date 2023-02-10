import React, { HTMLProps } from "react";
import { compatBrowser } from "ts/compat";

export const LinkTo = (props: HTMLProps<HTMLAnchorElement>) => {
    const { title, href, ...rest } = props;

    if (!href) return null;

    if (href?.startsWith("#")) {
        return <LinkToSection {...props} />;
    }

    const titleWithURL = [title, href].join("\n");
    const onClick = () =>
        compatBrowser.tabs.create({ active: true, url: href });

    return <a href={href} title={titleWithURL} onClick={onClick} {...rest} />;
};

const LinkToSection = (props: HTMLProps<HTMLAnchorElement>) => {
    const { title, href, ...rest } = props;

    return <a href={href} title={title} {...rest} />;
};
