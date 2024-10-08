import React from "react";
import { _ } from "ts/compat";
import { Microformat } from "ts/data/microformats";
import { HFeedAbout, HFeedData } from "ts/data/types/h-feed";
import { Icons } from "ts/ui/icon";
import { Alignment, Column, Row, Space } from "ts/ui/layout";
import { ExpandableCard } from "ts/ui/layout/expandable-card";
import { NullablePropsOf } from "ts/ui/props";
import { HEntry } from "ts/ui/microformats/h-feed/h-entry";
import {
    displayValueProperties,
    linkedValueProperties,
    PropertyRow,
    EmbeddedHCardProperty,
} from "ts/ui/microformats/common";

export const HFeed = (props: NullablePropsOf<HFeedData>) => {
    const feed = props.data;
    if (!feed) return null;
    const { about, entries } = feed;

    return (
        <ExpandableCard
            microformat={Microformat.H.Feed}
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
        <Column className="hfeed-about" space={Space.None}>
            <Row vertical={Alignment.Baseline} space={Space.Large} wrap>
                <PropertyRow
                    icon={{
                        image: photo?.[0],
                        imageMicroformat: Microformat.U.Photo,
                    }}
                    microformat={Microformat.P.Name}
                    hrefMicroformat={Microformat.U.Url}
                    values={linkedValueProperties(
                        name ?? [_("hfeed_unnamed")],
                        url,
                    )}
                    renderString={node => <h1>{node}</h1>}
                />

                <EmbeddedHCardProperty
                    className="by-line"
                    icon={Icons.Author}
                    microformat={Microformat.P.Author}
                    embeddedHCards={author}
                />
            </Row>

            <PropertyRow
                microformat={Microformat.P.Summary}
                values={displayValueProperties(summary)}
            />
        </Column>
    );
};
