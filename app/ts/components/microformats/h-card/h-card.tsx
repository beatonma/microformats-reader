import React, { useState } from "react";
import { Birthday } from "./birthday";
import { Location, LocationDetail } from "./location";
import { Name, NameDetail } from "./name";
import { Avatar } from "./primary-avatar";
import { ExpandableProps } from "ts/components/dropdown";
import { Icons } from "ts/components/icons";
import { HorizontalAlignment, Row } from "ts/components/layout";
import { Caption } from "ts/components/layout/caption";
import { InlineGroup } from "ts/components/layout/inline-group";
import { Gender, GenderDetail } from "ts/components/microformats/h-card/gender";
import {
    PropertyDiv,
    PropertySpan,
    PropertyUriDiv,
    PropertyUriSpan,
} from "ts/components/microformats/properties";
import { HCardData } from "ts/data/h-card";
import { Microformats } from "ts/data/microformats";
import "./hcard.scss";

export const HCard = (props: HCardProps & ExpandableProps) => {
    const [isExpanded, setExpanded] = useState(
        props.defaultIsExpanded ?? false
    );

    if (isExpanded) {
        return <HCardDetail {...props} onToggle={() => setExpanded(false)} />;
    } else {
        return <HCardCompact {...props} onToggle={() => setExpanded(true)} />;
    }
};

interface OnToggleExpand {
    onToggle?: () => void;
}
interface HCardProps {
    hcard: HCardData;
}

export const HCardCompact = (props: HCardProps & OnToggleExpand) => {
    const { name, nameDetail, url, photo, logo, birthday, location, gender } =
        props.hcard;

    return (
        <Row
            className={`${Microformats.H_Card}`}
            alignment={HorizontalAlignment.Start}
        >
            <Avatar photo={photo} logo={logo} />
            <div className="hcard-detail">
                <Name name={name} detail={nameDetail} />
                <Caption>
                    <Gender gender={gender} />
                    <Location location={location} />
                </Caption>
                <Caption className="light">
                    <InlineGroup>
                        <PropertyUriSpan
                            href={url}
                            cls={Microformats.U_Url}
                            value={url}
                        />
                    </InlineGroup>
                    <InlineGroup>
                        <PropertySpan
                            cls={Microformats.Dt_Bday}
                            icon={Icons.Birthday}
                            value={<Birthday birthday={birthday} />}
                        />
                    </InlineGroup>
                </Caption>
            </div>
        </Row>
    );
};

export const HCardDetail = (props: HCardProps & OnToggleExpand) => {
    const { name, nameDetail, url, photo, logo, birthday, location, gender } =
        props.hcard;

    return (
        <Row
            className={Microformats.H_Card}
            alignment={HorizontalAlignment.Start}
        >
            <Avatar photo={photo} logo={logo} />
            <div className="hcard-detail">
                <NameDetail name={name} detail={nameDetail} />
                <GenderDetail gender={gender} />
                <LocationDetail location={location} />

                <PropertyUriDiv
                    href={url}
                    cls={Microformats.U_Url}
                    icon={Icons.Url}
                    value={url}
                />
                <PropertyDiv
                    cls={Microformats.Dt_Bday}
                    icon={Icons.Birthday}
                    value={<Birthday birthday={birthday} />}
                />
            </div>
        </Row>
    );
};
