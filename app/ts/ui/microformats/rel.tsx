import React, { HTMLProps } from "react";
import { _ } from "ts/compat";
import { RelLink } from "ts/data/types/rel";
import { isEmptyOrNull } from "ts/data/util/arrays";
import { Icon, Icons } from "ts/ui/icon";
import { Dropdown } from "ts/ui/layout/dropdown";
import { LinkTo } from "ts/ui/link-to";
import "./rel.scss";

interface RelLinkProps {
    links: RelLink[] | null | undefined;
}
export const RelmeLinks = (props: RelLinkProps) => {
    const { links } = props;

    if (isEmptyOrNull(links)) return null;

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
            title="rel=me links"
            className="relme-links"
        >
            <button
                onClick={onClickVerify}
                title='Check each claimed rel="me" for return links.'
            >
                TODO Verify
            </button>

            {links.map(link => (
                <LinkTo href={link.href} title={link.title} key={link.href}>
                    {link.text}
                </LinkTo>
            ))}
        </Dropdown>
    );
};

interface IconRelLinkProps {
    icon: Icons;
    displayTitle: string;
}

const QuickLinks = (
    props: IconRelLinkProps & RelLinkProps & HTMLProps<HTMLDivElement>
) => {
    const { links, displayTitle, title, icon, ...rest } = props;

    if (!links) return null;

    return (
        <>
            {links.map(link => (
                <QuickLink
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
const QuickLink = (props: HTMLProps<HTMLDivElement> & QuickLinkProps) => {
    const { link, displayTitle, title, icon, ...rest } = props;
    return (
        <div className={`quick-link`} {...rest} key={link.href}>
            <LinkTo
                title={link.title ?? title ?? displayTitle}
                href={link.href}
            >
                <Icon icon={icon} />
                <div className="link-title">{displayTitle}</div>
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

export const Feeds = (props: RelLinkProps | null) => {
    if (!props) return null;
    return (
        <QuickLinks
            icon={Icons.RssFeed}
            displayTitle={_("quicklink_rss")}
            links={props.links}
        />
    );
};
