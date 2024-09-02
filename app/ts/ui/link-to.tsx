import React, { ComponentProps } from "react";
import { compatBrowser } from "ts/compat";
import { titles } from "ts/ui/util";
import { formatUri } from "ts/ui/formatting";

interface LinkProps extends Omit<ComponentProps<"a">, "href" | "onClick"> {
    href: string | null | undefined;
}

export const LinkTo = (props: LinkProps) => {
    const { children, title, href, ...rest } = props;

    if (!href) return null;
    const titleWithURL = titles(title, title?.includes(href) ? null : href);

    if (href.startsWith("#")) {
        return (
            <a href={href} title={titleWithURL} children={children} {...rest} />
        );
    }

    const openUrl = () =>
        compatBrowser.tabs.create({ active: true, url: href });

    return (
        <a
            href={href}
            title={titleWithURL}
            onClick={openUrl}
            children={
                React.Children.count(children) === 0
                    ? formatUri(href)
                    : children
            }
            {...rest}
        />
    );
};
