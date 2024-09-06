import { _ } from "ts/compat";
import { Icon, Icons } from "ts/ui/icon";
import { LinkTo } from "ts/ui/link-to";
import { NullablePropsOf } from "ts/ui/props";
import { FeedLinks, RelatedLinks, RelLink } from "ts/data/types/rel";
import React, { ComponentProps } from "react";
import { Alignment, Column, Row, Space } from "ts/ui/layout";
import { titles } from "ts/ui/util";

interface LinkProps {
    links: RelLink[] | null;
}

export const QuickLinks = (props: NullablePropsOf<RelatedLinks>) => {
    const { data } = props;
    if (!data) return null;
    return (
        <Row horizontal={Alignment.Center}>
            <Feeds feeds={data.feeds} />
            <WebmentionEndpoint links={data.webmention} />
            <PgpKey links={data.pgp} />
        </Row>
    );
};

interface IconRelLinkProps extends LinkProps {
    icon: Icons;
    description: string;
}
const _QuickLinks = (
    props: IconRelLinkProps & Omit<ComponentProps<"a">, "href">,
) => {
    const { links, description, title, icon, ...rest } = props;

    if (!links) return null;

    // No reliable way of choosing which link(s) to promote as shortcuts.
    // They will be shown in full in the {@link RelatedLinks} section anyway.
    if (links.length > 1) return null;

    return (
        <Row>
            {links.map(link => {
                return (
                    <LinkTo
                        key={link.href}
                        className="quick-link"
                        title={titles(title, link.title)}
                        href={link.href}
                        {...rest}
                    >
                        <Column
                            horizontal={Alignment.Center}
                            space={Space.Medium}
                        >
                            <Icon icon={icon} />
                            <div className="quick-link--title">
                                {description}
                            </div>
                        </Column>
                    </LinkTo>
                );
            })}
        </Row>
    );
};

const WebmentionEndpoint = (props: LinkProps) => (
    <_QuickLinks
        links={props.links}
        icon={Icons.WebmentionEndpoint}
        title={_("quicklink_webmentions_endpoint_hover")}
        description={_("quicklink_webmentions_endpoint")}
    />
);

const PgpKey = (props: LinkProps) => (
    <_QuickLinks
        links={props.links}
        icon={Icons.PgpKey}
        description={_("quicklink_pgp")}
    />
);

const Feeds = (props: { feeds: FeedLinks | null }) => {
    if (!props?.feeds) return null;

    return (
        <>
            <_QuickLinks
                icon={Icons.AtomFeed}
                description={_("quicklink_atom")}
                links={props.feeds.atom}
            />
            <_QuickLinks
                icon={Icons.RssFeed}
                description={_("quicklink_rss")}
                links={props.feeds.rss}
            />
        </>
    );
};
