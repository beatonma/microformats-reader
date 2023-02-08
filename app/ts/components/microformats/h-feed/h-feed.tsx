import React from "react";
import { CardContent, CardLayout } from "ts/components/layout/card";
import { HEntryData, HFeedAbout, HFeedData } from "ts/data/h-feed";
import "./h-feed.scss";

export const RawHFeed = (props: HFeedData) => {
    return <pre>{JSON.stringify(props, null, 2)}</pre>;
};

export const HFeed = (props: HFeedData) => {
    const { about, entries } = props;
    return (
        <CardLayout className="h-feed">
            <CardContent>
                <AboutHfeed {...about} />
                <div className="entries">{entries?.map(HEntry)}</div>
            </CardContent>
        </CardLayout>
    );
};

const AboutHfeed = (props: HFeedAbout) => {
    if (props == null) return null;

    const { name, author, summary, url, photo } = props;
    return <div className="hfeed-about">{name}</div>;
};

const HEntry = (props: HEntryData) => {
    const {
        name,
        summary,
        content,
        dates,
        author,
        lifeOf,
        inReplyTo,
        uid,
        url,
        location,
        rsvp,
        repostOf,
        syndication,
        category,
    } = props;
    return <div className="h-entry">{name}</div>;
};
