import React, { HTMLAttributes } from "react";
import { RelLinkProps } from "./parsing";
import { Dropdown } from "../dropdown";
import { ExternalLink } from "../external-link";
import { Icon, Icons } from "../icons";
import "./rel.scss";

export const RelmeLinks = (props: RelLinkProps) => {
    const { links } = props;

    if (!links) return null;

    return (
        <Dropdown header={"rel=me"}>
            {links.map(link => (
                <div>
                    <ExternalLink href={link.href} title={link.title}>
                        {link.text}
                    </ExternalLink>
                </div>
            ))}
        </Dropdown>
    );
};

interface IconRelLinkProps
    extends RelLinkProps,
        HTMLAttributes<HTMLDivElement> {
    icon: Icons;
}
const IconLink = (props: IconRelLinkProps) => {
    const { className, links, title, icon } = props;
    const link = links?.[0] ?? null;

    if (!link) return null;

    return (
        <div className={className}>
            <ExternalLink href={link.href} title={title}>
                <Icon icon={icon} />
            </ExternalLink>
        </div>
    );
};

export const WebmentionEndpoint = (props: RelLinkProps) => {
    return (
        <IconLink
            links={props.links}
            icon={Icons.WebmentionEndpoint}
            className={"webmention-endpoint"}
            title={"Webmention endpoint"}
        />
    );
};
