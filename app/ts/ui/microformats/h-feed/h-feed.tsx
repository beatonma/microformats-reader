import React from "react";
import { _ } from "ts/compat";
import { Microformat } from "ts/data/microformats";
import { HEntryData } from "ts/data/types/h-entry";
import { HFeedAbout, HFeedData } from "ts/data/types/h-feed";
import { TODO } from "ts/dev";
import { formatDateTime } from "ts/ui/formatting/time";
import { Icons } from "ts/ui/icon";
import { Row, Space } from "ts/ui/layout";
import { ExpandableCard } from "ts/ui/layout/expandable-card";
import { Authors } from "ts/ui/microformats/common/author";
import { Categories } from "ts/ui/microformats/common/categories";
import {
    displayValueProperties,
    onClickValueProperties,
    PropertyRow,
} from "ts/ui/microformats/common/properties";
import { NullablePropsOf } from "ts/ui/props";
import { LocationSummary } from "ts/ui/microformats/h-card/location";

export const HFeed = (props: NullablePropsOf<HFeedData>) => {
    const feed = props.data;
    if (!feed) return null;
    const { about, entries } = feed;

    return (
        <ExpandableCard
            className={Microformat.H.Feed}
            defaultIsExpanded={true}
            contentDescription={""}
            sharedContent={<AboutHFeed data={about} />}
            summaryContent={null}
            detailContent={
                <div className="entries">
                    {entries?.map((entry, index) => (
                        <HEntry {...entry} key={index} />
                    ))}
                </div>
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
        <div className="hfeed-about">
            <h1>
                <PropertyRow
                    icon={{
                        image: photo?.[0],
                        imageMicroformat: Microformat.U.Photo,
                    }}
                    microformat={Microformat.P.Name}
                    values={displayValueProperties(
                        name ?? [_("hfeed_unnamed")],
                    )}
                />
            </h1>

            <Row space={Space.Small} className="by-line">
                <Authors authors={author} />

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
        </div>
    );
};

const HEntry = (props: HEntryData) => {
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
    } = props;

    TODO("interactions");
    TODO("embedded author hcard, if different from h-feed author");

    const dateUpdated = dates?.updated
        ?.map(dt => _("date_updated", formatDateTime(dt)))
        ?.join(", ");

    return (
        <div className={Microformat.H.Entry}>
            <Row className="h-entry--metadata" wrap space={Space.Medium}>
                <PropertyRow
                    microformat={Microformat.Dt.Published}
                    values={dates?.published?.map(it => ({ displayValue: it }))}
                    property={{ title: dateUpdated }}
                />

                <Categories data={category} />
                <LocationSummary
                    microformat={Microformat.P.Location}
                    locations={location}
                />
            </Row>

            <PropertyRow
                microformat={Microformat.P.Name}
                values={name?.map((it, index) => ({
                    displayValue: it,
                    onClick: url?.[index] ?? null,
                }))}
            />
            <PropertyRow
                microformat={Microformat.P.Summary}
                values={displayValueProperties(summary)}
            />
        </div>
    );
};
