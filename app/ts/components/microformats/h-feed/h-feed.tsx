import React from "react";
import { CardContent, CardLayout } from "ts/components/layout/card";
import { Property } from "ts/components/microformats/properties";
import { PropsOf } from "ts/components/props";
import { Microformat } from "ts/data/microformats";
import { HEntryData } from "ts/data/types/h-entry";
import { HFeedAbout, HFeedData } from "ts/data/types/h-feed";
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
                microformat={Microformat.PlainProp.P_Name}
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
        <div className="h-entry">
            <Property
                microformat={Microformat.PlainProp.P_Name}
                href={url}
                displayValue={name}
            />
        </div>
    );
};
