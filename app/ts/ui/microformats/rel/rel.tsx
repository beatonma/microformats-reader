import React, { useContext } from "react";
import { _ } from "ts/compat";
import { RelatedLinks as RelatedLinksData, RelLink } from "ts/data/types/rel";
import { withNotNull } from "ts/data/util/object";
import { OptionsContext } from "ts/options";
import { formatUri } from "ts/ui/formatting";
import { Column, Row, Space } from "ts/ui/layout";
import { ExpandableCard } from "ts/ui/layout/expandable-card";
import { LinkTo } from "ts/ui/link-to";
import { DetailSection } from "ts/ui/microformats/common";
import { NullablePropsOf } from "ts/ui/props";
import { titles } from "ts/ui/util";

export const RelatedLinks = (props: NullablePropsOf<RelatedLinksData>) => {
    if (props.data == null) return null;

    const { feeds, search, pgp, relme, webmention, alternate } = props.data;

    return (
        <ExpandableCard
            className="related-links"
            microformat={null}
            sharedContent={<h1>{_("rellinks")}</h1>}
            summaryContent={null}
            detailContent={
                <Column>
                    <LinksGroup title={_("rellinks_me")} links={relme} />

                    <LinksGroup
                        title={_("rellinks_alternate")}
                        links={alternate}
                    />
                    <LinksGroup title={_("rellinks_search")} links={search} />
                    <LinksGroup title={_("rellinks_pgp")} links={pgp} />

                    <LinksGroup
                        title={_("rellinks_webmention")}
                        links={webmention}
                    />

                    <LinksGroup
                        title={_("rellinks_feeds")}
                        links={[
                            ...(feeds?.rss ?? []),
                            ...(feeds?.atom ?? []),
                        ].nullIfEmpty()}
                    />
                </Column>
            }
        />
    );
};

const LinksGroup = (props: {
    title: string;
    links: RelLink[] | null | undefined;
}) => {
    const options = useContext(OptionsContext);
    return (
        <DetailSection
            options={options}
            sectionTitle={props.title}
            dependsOn={props.links}
            render={links => (
                <Column>
                    {links.map(link => (
                        <Row className="related-link" space={Space.Medium} wrap>
                            <LinkTo
                                href={link.href}
                                title={link.title ?? undefined}
                                key={link.href}
                            >
                                {link.text ??
                                    link.title ??
                                    formatUri(link.href)}
                            </LinkTo>

                            <Row className="related-link--meta" wrap>
                                {withNotNull(link.type, type => (
                                    <span title={titles(type, "type")}>
                                        {formatContentType(type)}
                                    </span>
                                ))}

                                {withNotNull(link.lang, lang => (
                                    <span title="lang">{lang}</span>
                                ))}
                            </Row>
                        </Row>
                    ))}
                </Column>
            )}
        />
    );
};

const formatContentType = (contentType: string): string => {
    return (
        {
            "application/rss+xml": "RSS",
            "application/atom+xml": "Atom",
            "application/opensearchdescription+xml": "OpenSearch",
            "application/pagefind": "Pagefind",
        }[contentType] ?? contentType
    );
};
