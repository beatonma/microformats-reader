import React, { useState } from "react";
import { Birthday } from "./birthday";
import { Location, LocationDetail } from "./location";
import { Name, NameDetail } from "./name";
import { Avatar } from "./primary-avatar";
import { Icons } from "ts/components/icons";
import { HorizontalAlignment, Row } from "ts/components/layout";
import { Caption } from "ts/components/layout/caption";
import {
    DropdownButton,
    ExpandableDefaultProps,
    ExpandableProps,
} from "ts/components/layout/dropdown";
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

interface HCardProps {
    hcard: HCardData;
}

export const HCard = (props: HCardProps & ExpandableDefaultProps) => {
    const [isExpanded, setExpanded] = useState(
        props.defaultIsExpanded ?? false
    );

    const toggleExpanded = () => setExpanded(!isExpanded);

    return (
        <div className="h-card">
            <ExpandableHCard
                hcard={props.hcard}
                isExpanded={isExpanded}
                onToggleExpand={toggleExpanded}
            />
            <div id="hcard_toggle_detail" onClick={toggleExpanded}>
                <DropdownButton isExpanded={isExpanded} />
            </div>
        </div>
    );
};

const ExpandableHCard = (props: HCardProps & ExpandableProps) => {
    const { isExpanded } = props;
    if (isExpanded) {
        return <HCardDetail {...props} />;
    } else {
        return <HCardCompact {...props} />;
    }
};

export const HCardCompact = (props: HCardProps & ExpandableProps) => {
    const { name, nameDetail, images, gender, contact, location, job, dates } =
        props.hcard;

    return (
        <Row
            className={`${Microformats.H_Card} compact`}
            alignment={HorizontalAlignment.Start}
        >
            <Avatar {...images} />
            <div className="hcard-detail">
                <Row alignment={HorizontalAlignment.SpaceBetween}>
                    <Name name={name} detail={nameDetail} />
                </Row>
                <Caption>
                    <Row>
                        <Gender gender={gender} />
                        <Location location={location} />
                    </Row>
                </Caption>
                <Caption className="light">
                    <Row>
                        <InlineGroup>
                            <PropertyUriDiv
                                href={contact.url}
                                cls={Microformats.U_Url}
                                value={contact.url}
                            />
                        </InlineGroup>
                        <InlineGroup>
                            <PropertyDiv
                                cls={Microformats.Dt_Bday}
                                icon={Icons.Birthday}
                                value={<Birthday birthday={dates.birthday} />}
                            />
                        </InlineGroup>
                    </Row>
                </Caption>

                {/*<DropdownButton*/}
                {/*    id="hcard_show_full"*/}
                {/*    isExpanded={props.isExpanded}*/}
                {/*    onToggleExpand={props.onToggleExpand}*/}
                {/*/>*/}
            </div>
        </Row>
    );
};

export const HCardDetail = (props: HCardProps & ExpandableProps) => {
    const {
        name,
        nameDetail,
        images,
        gender,
        contact,
        location,
        job,
        dates,
        uid,
        category,
        notes,
    } = props.hcard;

    return (
        <div className={`${Microformats.H_Card} full`}>
            <Avatar {...images} />

            <div className="hcard-detail"></div>
        </div>
    );

    // return (
    //     <Row
    //         className={Microformats.H_Card}
    //         alignment={HorizontalAlignment.Start}
    //     >
    //         <Avatar photo={photo} logo={logo} />
    //         <div className="hcard-detail">
    //             <NameDetail name={name} detail={nameDetail} />
    //             <GenderDetail gender={gender} />
    //             <LocationDetail location={location} />
    //
    //             <PropertyUriDiv
    //                 href={contact.url}
    //                 cls={Microformats.U_Url}
    //                 icon={Icons.Url}
    //                 value={contact.url}
    //             />
    //             <PropertyDiv
    //                 cls={Microformats.Dt_Bday}
    //                 icon={Icons.Birthday}
    //                 value={<Birthday birthday={dates.birthday} />}
    //             />
    //         </div>
    //     </Row>
    // );
};
