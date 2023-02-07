import React, { HTMLProps } from "react";
import { _ } from "ts/compat";
import { Icon, Icons } from "ts/components/icon";
import { Dropdown } from "ts/components/layout/dropdown";
import { LinkTo } from "ts/components/link-to";
import { RelLink } from "ts/data/related-links";
import "./rel.scss";

interface RelLinkProps {
    links: RelLink[];
}
export const RelmeLinks = (props: RelLinkProps) => {
    const { links } = props;

    if (!links) return null;

    const onClickVerify = () => {
        console.log("TODO verify rel=me links");
    };

    return (
        <Dropdown
            header={
                <>
                    <span>rel=me</span>
                </>
            }
            defaultIsExpanded={false}
            className="relme-links"
        >
            <button
                onClick={onClickVerify}
                title='Check each claimed rel="me" for return links.'
            >
                TODO Verify
            </button>
            {links.map(link => (
                <div key={link.href}>
                    <LinkTo href={link.href} title={link.title}>
                        {link.text}
                    </LinkTo>
                </div>
            ))}
        </Dropdown>
    );
};

interface IconRelLinkProps extends RelLinkProps, HTMLProps<HTMLDivElement> {
    icon: Icons;
    displayTitle: string;
}

const QuickLinks = (props: IconRelLinkProps) => {
    const { links, displayTitle, title, icon, ...rest } = props;

    if (!links) return null;

    return (
        <>
            {links.map(link => (
                <div className={`quick-link`} {...rest} key={link.href}>
                    <LinkTo
                        title={link.title ?? title ?? displayTitle}
                        href={link.href}
                    >
                        <Icon icon={icon} />
                        <div className="link-title">{displayTitle}</div>
                    </LinkTo>
                </div>
            ))}
        </>
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

export const Feeds = (props: RelLinkProps) => {
    return (
        <QuickLinks
            icon={Icons.RssFeed}
            displayTitle={_("quicklink_rss")}
            links={props.links}
        />
    );
};
