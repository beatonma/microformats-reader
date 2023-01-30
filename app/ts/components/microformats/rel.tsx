import React, { HTMLProps } from "react";
import { RelLinkProps } from "../../data/related-links";
import { Dropdown } from "../dropdown";
import { ExternalLink } from "../external-link";
import { Icon, Icons } from "../icons";
import "./rel.scss";

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
            defaultIsExpanded={true}
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
                    <ExternalLink href={link.href} title={link.title}>
                        {link.text}
                    </ExternalLink>
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
                    <ExternalLink
                        title={link.title ?? title ?? displayTitle}
                        href={link.href}
                    >
                        <Icon icon={icon} />
                        <div className="link-title">{displayTitle}</div>
                    </ExternalLink>
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
            title={"Webmention endpoint"}
            displayTitle={`Webmentions`}
        />
    );
};

export const PgpKey = (props: RelLinkProps) => {
    return (
        <QuickLinks
            links={props.links}
            icon={Icons.PgpKey}
            displayTitle={`PGP Key`}
        />
    );
};

export const Feeds = (props: RelLinkProps) => {
    return (
        <QuickLinks
            icon={Icons.RssFeed}
            displayTitle="RSS"
            links={props.links}
        />
    );
};
