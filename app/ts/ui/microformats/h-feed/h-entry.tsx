import { HEntryData } from "ts/data/types";
import { _ } from "ts/compat";
import { Alignment, Column, Row, Space } from "ts/ui/layout";
import { Microformat } from "ts/data/microformats";
import {
    displayValueProperties,
    EmbeddedHCardProperty,
    linkedValueProperties,
    onClickValueProperties,
    PropertyColumn,
    PropertyContainerColumn,
    PropertyImage,
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
import { Author } from "ts/data/types/common";
import { Image } from "@microformats-parser";

interface HEntryProps {
    hFeedAuthor: Author[] | null;
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
        photo,
        video,
    } = entry;

    return (
        <Row
            className={Microformat.H.Entry}
            title={Microformat.H.Entry}
            space={Space.Large}
            horizontal={Alignment.SpaceBetween}
            stretch
        >
            <Column
                className="h-entry--main"
                vertical={Alignment.Start}
                space={Space.None}
            >
                <NameSummaryContentLink
                    name={name}
                    summary={summary}
                    content={content}
                    url={url}
                />

                <Row className="h-entry--metadata" wrap space={Space.Medium}>
                    <PropertyRow
                        microformat={Microformat.Dt.Published}
                        values={displayValueProperties(dates?.published)}
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

            <Photo photo={photo} />
        </Row>
    );
};

const NameSummaryContentLink = (props: {
    name: string[] | null;
    summary: string[] | null;
    content: string[] | null;
    url: string[] | null;
}) => {
    const { name, summary, content, url } = props;

    if (name) {
        return (
            <>
                <PropertyRow
                    microformat={Microformat.P.Name}
                    hrefMicroformat={Microformat.U.Url}
                    values={linkedValueProperties(name, url)}
                />
                <PropertyRow
                    microformat={Microformat.P.Summary}
                    values={displayValueProperties(summary)}
                />
            </>
        );
    }

    if (summary) {
        return (
            <PropertyRow
                microformat={Microformat.P.Summary}
                hrefMicroformat={Microformat.U.Url}
                values={linkedValueProperties(summary, url)}
            />
        );
    }

    if (content) {
        return (
            <PropertyRow
                microformat={Microformat.E.Content}
                hrefMicroformat={Microformat.U.Url}
                values={linkedValueProperties(content, url)}
            />
        );
    }

    return (
        <PropertyRow
            microformat={Microformat.U.Url}
            values={onClickValueProperties(url)}
        />
    );
};

const CategoriesRow = (props: NullablePropsOf<string[]>) => {
    const { data: categories } = props;

    if (isEmptyOrNull(categories)) return null;

    return (
        <PropertyRow
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
            <CitationTooltip
                microformat={Microformat.U.LikeOf}
                name={_("interaction_like_of")}
                data={likeOf}
            />
            <CitationTooltip
                microformat={Microformat.U.RepostOf}
                name={_("interaction_repost_of")}
                data={repostOf}
            />
            <CitationTooltip
                microformat={Microformat.U.InReplyTo}
                name={_("interaction_reply_to")}
                data={inReplyTo}
            />
            <InteractionTooltip
                value={rsvp}
                tooltip={values => (
                    <PropertyColumn
                        property={{ displayName: _("interaction_rsvp") }}
                        microformat={Microformat.P.Rsvp}
                        values={displayValueProperties(
                            values.map(it => _(`interaction_rsvp_${it}`)),
                        )}
                    />
                )}
                content={() => (
                    <TooltipRoot
                        microformat={Microformat.P.Rsvp}
                        text={_("interaction_rsvp")}
                    />
                )}
            />
            <InteractionTooltip
                value={syndication}
                tooltip={links => (
                    <PropertyColumn
                        property={{ displayName: _("interaction_syndication") }}
                        microformat={Microformat.U.Syndication}
                        values={onClickValueProperties(links)}
                    />
                )}
                content={() => (
                    <TooltipRoot
                        microformat={Microformat.U.Syndication}
                        text={_("interaction_syndication")}
                    />
                )}
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

const CitationTooltip = (props: {
    name: string;
    microformat: Microformat.U;
    data: HCiteData[] | null;
}) => {
    const { name, data, microformat } = props;

    return (
        <InteractionTooltip
            value={data}
            tooltip={cite => (
                <PropertyContainerColumn
                    microformat={microformat}
                    property={{ displayName: name }}
                >
                    {cite.map(item => (
                        <Citation {...item} />
                    ))}
                </PropertyContainerColumn>
            )}
            content={() => (
                <TooltipRoot microformat={microformat} text={name} />
            )}
        />
    );
};

const TooltipRoot = (props: { microformat: Microformat; text: string }) => (
    <span title={props.microformat}>{props.text}</span>
);

const Citation = (props: HCiteData) => {
    const {
        name,
        uid,
        url,
        author,
        content,
        dateAccessed,
        datePublished,
        publication,
    } = props;
    return (
        <Column
            className={Microformat.H.Cite}
            data-microformat={Microformat.H.Cite}
            title={Microformat.H.Cite}
        >
            <PropertyRow
                microformat={Microformat.P.Name}
                hrefMicroformat={url ? Microformat.U.Url : Microformat.U.Uid}
                values={linkedValueProperties(name, url ?? uid)}
            />
            <Row space={Space.Medium} className="by-line">
                <PropertyRow
                    microformat={Microformat.Dt.Accessed}
                    values={displayValueProperties(dateAccessed)}
                />
                <EmbeddedHCardProperty
                    icon={Icons.Author}
                    microformat={Microformat.P.Author}
                    embeddedHCards={author}
                />
                <PropertyRow
                    microformat={Microformat.P.Publication}
                    values={displayValueProperties(publication)}
                />
            </Row>
        </Column>
    );
};

const Photo = (props: { photo: Image[] | null }) => {
    const { photo } = props;
    if (!photo) return null;

    return <PropertyImage microformat={Microformat.U.Photo} value={photo[0]} />;
};
