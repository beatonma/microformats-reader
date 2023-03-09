import React from "react";
import { _ } from "ts/compat";
import { Microformat } from "ts/data/microformats";
import { HEntryData } from "ts/data/types/h-entry";
import { HFeedAbout, HFeedData } from "ts/data/types/h-feed";
import { TODO } from "ts/dev";
import { formatDateTime } from "ts/ui/formatting/time";
import { Icons } from "ts/ui/icon";
import { HorizontalAlignment, Row } from "ts/ui/layout";
import { ExpandableCard } from "ts/ui/layout/expandable-card";
import { Author } from "ts/ui/microformats/common/author";
import { Categories } from "ts/ui/microformats/common/categories";
import { Property } from "ts/ui/microformats/common/properties";
import { PropsOf } from "ts/ui/props";

export const HFeed = (props: PropsOf<HFeedData>) => {
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

const AboutHFeed = (props: PropsOf<HFeedAbout>) => {
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
                <Property
                    image={photo}
                    imageMicroformat={Microformat.U.Photo}
                    microformat={Microformat.P.Name}
                    displayValue={name ?? _("hfeed_unnamed")}
                />
            </h1>

            <Row spaced>
                <Author author={author} />

                <Property
                    microformat={Microformat.U.Url}
                    icon={Icons.Link}
                    href={url}
                />
            </Row>

            <Property
                microformat={Microformat.P.Summary}
                displayValue={summary}
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
    TODO("location");

    const dateUpdated = dates?.updated
        ?.map(dt => _("date_updated", formatDateTime(dt)))
        .join(", ");

    return (
        <div className={Microformat.H.Entry}>
            <Row alignment={HorizontalAlignment.SpaceBetween}>
                <Property
                    microformat={Microformat.P.Name}
                    href={url}
                    displayValue={name}
                />
                <Property
                    microformat={Microformat.Dt.Published}
                    displayValue={dates?.published}
                    title={dateUpdated}
                />
            </Row>

            <Property
                microformat={Microformat.P.Summary}
                displayValue={summary}
            />

            <Categories data={category} />
        </div>
    );
};
