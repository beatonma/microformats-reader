import React, { HTMLAttributes } from "react";
import { compatBrowser } from "ts/compat";
import { titles } from "ts/ui/util";

interface LinkProps extends HTMLAttributes<HTMLAnchorElement> {
    href: string | null | undefined;
}

export const LinkTo = (props: LinkProps) => {
    const { title, href, onClick, ...rest } = props;

    if (!href) return null;

    if (href?.startsWith("#")) {
        return <LinkToSection {...props} />;
    }

    const titleWithURL = titles(title, href);
    const openUrl = () =>
        compatBrowser.tabs.create({ active: true, url: href });

    return (
        <a
            href={href}
            title={titleWithURL}
            onClick={onClick ?? openUrl}
            {...rest}
        />
    );
};

export const MaybeLinkTo = (props: LinkProps) => {
    const { href, ...rest } = props;
    if (href) return <LinkTo {...props} />;

    return <span {...rest} />;
};

const LinkToSection = (props: LinkProps) => {
    const { title, href, ...rest } = props;

    return <a href={href ?? undefined} title={title} {...rest} />;
};
