import React from "react";
import { Microformat } from "ts/data/microformats";
import { HEntryData } from "ts/data/types/h-entry";
import { HFeedAbout, HFeedData } from "ts/data/types/h-feed";
import { HorizontalAlignment, Row } from "ts/ui/layout";
import { CardContent, CardLayout } from "ts/ui/layout/card";
import { Dropdown } from "ts/ui/layout/dropdown";
import { Property } from "ts/ui/microformats/properties";
import { PropsOf } from "ts/ui/props";
import "./h-feed.scss";

export const HFeed = (props: PropsOf<HFeedData>) => {
    const feed = props.data;
    if (!feed) return null;
    const { about, entries } = feed;

    return (
        <CardLayout className="h-feed">
            <CardContent>
                <AboutHFeed data={about} />

                <div className="entries">
                    {entries?.map((entry, index) => (
                        <HEntry {...entry} key={index} />
                    ))}
                </div>
            </CardContent>
        </CardLayout>
    );
};

const AboutHFeed = (props: PropsOf<HFeedAbout>) => {
    const about = props.data;
    if (!about) return null;

    const { name, author, summary, url, photo } = about;
    return (
        <div className="hfeed-about">
            <Property
                image={photo}
                microformat={Microformat.P.Name}
                href={url}
                displayValue={name}
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

    return (
        <Dropdown
            header={<HEntrySummary {...props} />}
            title="h-entry"
            className="h-entry"
        ></Dropdown>
    );
};

const HEntrySummary = (props: HEntryData) => {
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
    return (
        <>
            <div>
                <Row alignment={HorizontalAlignment.SpaceBetween}>
                    <Property
                        microformat={Microformat.P.Name}
                        href={url}
                        displayValue={name}
                    />
                    <Property
                        microformat={Microformat.Dt.Published}
                        displayValue={dates?.published}
                    />
                </Row>
            </div>

            <Property
                microformat={Microformat.P.Summary}
                displayValue={summary}
            />
        </>
    );
};
