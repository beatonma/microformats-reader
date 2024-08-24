import React from "react";
import { _ } from "ts/compat";
import { Microformat } from "ts/data/microformats";
import { HEntryData } from "ts/data/types/h-entry";
import { HFeedAbout, HFeedData } from "ts/data/types/h-feed";
import { TODO } from "ts/dev";
import { formatDateTime } from "ts/ui/formatting/time";
import { Icons } from "ts/ui/icon";
import { Column, Row, Space } from "ts/ui/layout";
import { ExpandableCard } from "ts/ui/layout/expandable-card";
import { Categories } from "ts/ui/microformats/common/categories";
import {
    displayValueProperties,
    EmbeddedHCardProperty,
    linkedValueProperties,
    onClickValueProperties,
    PropertyRow,
} from "ts/ui/microformats/common/properties";
import { NullablePropsOf } from "ts/ui/props";
import { LocationSummary } from "ts/ui/microformats/h-card/location";
import { EmbeddedHCard } from "ts/data/types/h-card";

export const HFeed = (props: NullablePropsOf<HFeedData>) => {
    const feed = props.data;
    if (!feed) return null;
    const { about, entries } = feed;

    return (
        <ExpandableCard
            className={Microformat.H.Feed}
            defaultIsExpanded={true}
            contentDescription={_("hfeed_dropdown_content_description")}
            sharedContent={<AboutHFeed data={about} />}
            summaryContent={null}
            detailContent={
                <Column className="entries" space={Space.Large}>
                    {entries?.map((entry, index) => (
                        <HEntry
                            key={index}
                            hFeedAuthor={about?.author ?? null}
                            entry={entry}
                        />
                    ))}
                </Column>
            }
        />
    );
};

const AboutHFeed = (props: NullablePropsOf<HFeedAbout>) => {
    const about = props.data;
    if (!about)
        return (
            <div className="hfeed-about">
                <h1>{_("hfeed_unnamed")}</h1>
            </div>
        );

    const { name, author, summary, url, photo } = about;
    return (
        <Column className="hfeed-about">
            <h1>
                <PropertyRow
                    icon={{
                        image: photo?.[0],
                        imageMicroformat: Microformat.U.Photo,
                    }}
                    microformat={Microformat.P.Name}
                    values={linkedValueProperties(
                        name ?? [_("hfeed_unnamed")],
                        url,
                    )}
                />
            </h1>

            <Row space={Space.Small} className="by-line">
                <EmbeddedHCardProperty
                    microformat={Microformat.P.Author}
                    embeddedHCards={author}
                />

                <PropertyRow
                    microformat={Microformat.U.Url}
                    icon={Icons.Link}
                    values={onClickValueProperties(url)}
                />
            </Row>

            <PropertyRow
                microformat={Microformat.P.Summary}
                values={displayValueProperties(summary)}
            />
        </Column>
    );
};

interface HEntryProps {
    hFeedAuthor: EmbeddedHCard[] | null;
    entry: HEntryData;
}
const HEntry = (props: HEntryProps) => {
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

    const dateUpdated = dates?.updated
        ?.map(dt => _("date_updated", formatDateTime(dt)))
        ?.join(", ");

    return (
        <Column className={Microformat.H.Entry}>
            <PropertyRow
                microformat={[Microformat.P.Name, Microformat.U.Url]}
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
                <Categories data={category} />
                <PropertyRow
                    microformat={Microformat.U.Uid}
                    values={onClickValueProperties(uid)}
                />
            </Row>
        </Column>
    );
};
