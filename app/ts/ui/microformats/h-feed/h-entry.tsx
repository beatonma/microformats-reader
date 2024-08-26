import { EmbeddedHCard } from "ts/data/types/h-card";
import { HEntryData } from "ts/data/types";
import { Todo, TODO } from "ts/dev";
import { _ } from "ts/compat";
import { formatDateTime } from "ts/ui/formatting/time";
import { Column, Row, Space } from "ts/ui/layout";
import { Microformat } from "ts/data/microformats";
import {
    displayValueProperties,
    EmbeddedHCardProperty,
    linkedValueProperties,
    onClickValueProperties,
    PropertyRow,
} from "ts/ui/microformats/common/properties";
import { Icons } from "ts/ui/icon";
import { LocationSummary } from "ts/ui/microformats/h-card/location";
import { NullablePropsOf } from "ts/ui/props";
import { HEntryInteractions } from "ts/data/types/h-entry";
import { withNotNull } from "ts/data/util/object";
import { Tooltip } from "ts/ui/layout/tooltip";
import React, { ReactNode } from "react";
import { isEmptyOrNull, joinNotEmpty } from "ts/data/util/arrays";
import { HCiteData } from "ts/data/types/h-cite";
import { LinkTo } from "ts/ui/link-to";

interface HEntryProps {
    hFeedAuthor: EmbeddedHCard[] | null;
    entry: HEntryData;
}
export const HEntry = (props: HEntryProps) => {
    const { entry, hFeedAuthor } = props;
    const {
        name,
        summary,
        content,
        dates,
        author,
        interactions,
        uid,
        url,
        location,
        category,
    } = entry;

    TODO("interactions");
    TODO("photo or video");

    const dateUpdated = dates?.updated
        ?.map(dt => _("date_updated", formatDateTime(dt)))
        ?.join(", ");

    return (
        <Column className={Microformat.H.Entry}>
            <PropertyRow
                microformat={Microformat.P.Name}
                hrefMicroformat={Microformat.U.Url}
                values={linkedValueProperties(name, url)}
            />
            <PropertyRow
                microformat={Microformat.P.Summary}
                values={displayValueProperties(summary)}
            />

            <Row className="h-entry--metadata" wrap space={Space.Large}>
                <PropertyRow
                    microformat={Microformat.Dt.Published}
                    values={dates?.published?.map(it => ({ displayValue: it }))}
                    property={{ title: dateUpdated }}
                />
                {author === hFeedAuthor ? null : (
                    <Row wrap space={Space.Char}>
                        <EmbeddedHCardProperty
                            icon={Icons.Author}
                            microformat={Microformat.P.Author}
                            embeddedHCards={author}
                        />
                    </Row>
                )}
                <LocationSummary
                    microformat={Microformat.P.Location}
                    locations={location}
                />
                <CategoriesRow data={category} />
                <PropertyRow
                    microformat={Microformat.U.Uid}
                    values={onClickValueProperties(uid)}
                />
            </Row>

            <Row className="h-entry--interactions">
                <Interactions data={interactions} />
            </Row>
        </Column>
    );
};

const CategoriesRow = (props: NullablePropsOf<string[]>) => {
    const { data: categories } = props;

    if (isEmptyOrNull(categories)) return null;

    return (
        <PropertyRow
            className="categories"
            microformat={Microformat.P.Category}
            icon={Icons.Tag}
            values={{ displayValue: joinNotEmpty(", ", categories) }}
        />
    );
};

const Interactions = (props: NullablePropsOf<HEntryInteractions>) => {
    if (!props.data) return null;
    const { rsvp, likeOf, repostOf, inReplyTo, syndication } = props.data;

    return (
        <>
            <InteractionTooltip
                value={rsvp}
                tooltip={it => _(`interaction_rsvp_${it}`)}
                content={() => _("interaction_rsvp")}
            />
            <Citation cite={likeOf} />
            <Citation cite={repostOf} />
            <Citation cite={inReplyTo} />
            <InteractionTooltip
                value={syndication}
                tooltip={links => (
                    <>
                        {links.map(link => (
                            <LinkTo href={link} key={link} />
                        ))}
                    </>
                )}
                content={() => _("interaction_syndication")}
            />
        </>
    );
};

const InteractionTooltip = <T extends any>(props: {
    value: T | null;
    tooltip: (value: T) => ReactNode;
    content: (value: T) => ReactNode;
}) =>
    withNotNull(props.value, it => (
        <Tooltip tooltip={props.tooltip(it)}>{props.content(it)}</Tooltip>
    ));

const Citation = (props: { cite: string[] | HCiteData | null }) => {
    const { cite } = props;

    return <Todo message="citation" />;
};
