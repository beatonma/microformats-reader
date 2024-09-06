import React, { ComponentProps } from "react";
import { _ } from "ts/compat";
import { FeedLinks, RelLink } from "ts/data/types/rel";
import { Icon, Icons } from "ts/ui/icon";
import { Dropdown } from "ts/ui/layout/dropdown";
import { LinkTo } from "ts/ui/link-to";
import { Alignment, Column, Space } from "ts/ui/layout";

interface RelLinkProps {
    links: RelLink[] | null | undefined;
}
export const RelmeLinks = (props: RelLinkProps) => {
    const { links } = props;

    if (links == null) return null;
    const title = 'rel="me"';

    return (
        <Dropdown
            header={title}
            title={title}
            dropdownButtonTitle={title}
            className="relme-links"
        >
            <Column>
                {links.map(link => (
                    <LinkTo href={link.href} title={link.title} key={link.href}>
                        {link.text}
                    </LinkTo>
                ))}
            </Column>
        </Dropdown>
    );
};

interface IconRelLinkProps {
    icon: Icons;
    displayTitle: string;
}

const QuickLinks = (
    props: IconRelLinkProps & RelLinkProps & ComponentProps<"div">,
) => {
    const { links, displayTitle, title, icon, ...rest } = props;

    if (!links) return null;

    return (
        <>
            {links.map((link, index) => (
                <QuickLink
                    key={index}
                    link={link}
                    icon={icon}
                    displayTitle={displayTitle}
                    title={title}
                    {...rest}
                />
            ))}
        </>
    );
};

interface QuickLinkProps {
    link: RelLink;
    icon: Icons;
    title?: string;
    displayTitle: string;
}
const QuickLink = (props: ComponentProps<"div"> & QuickLinkProps) => {
    const { link, displayTitle, title, icon, ...rest } = props;
    return (
        <div className="quick-link" {...rest} key={link.href}>
            <LinkTo
                title={link.title ?? title ?? displayTitle}
                href={link.href}
            >
                <Column horizontal={Alignment.Center} space={Space.Medium}>
                    <Icon icon={icon} />
                    <div className="link-title">{displayTitle}</div>
                </Column>
            </LinkTo>
        </div>
    );
};

export const WebmentionEndpoint = (props: RelLinkProps) => {
    return (
        <QuickLinks
            links={props.links}
            icon={Icons.WebmentionEndpoint}
            title={_("quicklink_webmentions_endpoint_hover")}
            displayTitle={_("quicklink_webmentions_endpoint")}
        />
    );
};

export const PgpKey = (props: RelLinkProps) => {
    return (
        <QuickLinks
            links={props.links}
            icon={Icons.PgpKey}
            displayTitle={_("quicklink_pgp")}
        />
    );
};

export const Feeds = (props: { feeds: FeedLinks | null }) => {
    if (!props?.feeds) return null;

    return (
        <>
            <QuickLinks
                icon={Icons.AtomFeed}
                displayTitle={_("quicklink_atom")}
                links={props.feeds.atom}
            />
            <QuickLinks
                icon={Icons.RssFeed}
                displayTitle={_("quicklink_rss")}
                links={props.feeds.rss}
            />
        </>
    );
};
