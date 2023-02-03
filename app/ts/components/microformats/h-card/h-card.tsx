import React, { useState } from "react";
import { HorizontalAlignment, Row } from "ts/components/layout";
import {
    DropdownButton,
    ExpandableDefaultProps,
} from "ts/components/layout/dropdown";
import { InlineGroup } from "ts/components/layout/inline-group";
import { Avatar } from "ts/components/microformats/h-card/avatar";
import { Dates } from "ts/components/microformats/h-card/dates";
import { Gender } from "ts/components/microformats/h-card/gender";
import { PropertyUriDiv } from "ts/components/microformats/properties";
import { HCardData } from "ts/data/h-card";
import { Microformats } from "ts/data/microformats";
import { Location } from "./location";
import { Name, NameDetail } from "./name";
import "./hcard.scss";

export const HCard = (props: HCardData & ExpandableDefaultProps) => {
    const { defaultIsExpanded, images, ...rest } = props;
    const [isExpanded, setExpanded] = useState(defaultIsExpanded ?? false);

    const toggleExpanded = () => setExpanded(!isExpanded);

    return (
        <div className="hcard-wrapper">
            <div className="h-card" data-expanded={isExpanded}>
                <Row className="banner">
                    <Avatar name={props.name} {...images} />
                    <HCardTextSummary {...rest} />
                </Row>

                <div className="detail-wrapper">
                    <HCardTextDetail {...rest} />
                </div>
            </div>
            <div id="hcard_toggle_detail" onClick={toggleExpanded}>
                <DropdownButton isExpanded={isExpanded} />
            </div>
        </div>
    );
};

const HCardTextSummary = (props: HCardData) => {
    const { name, nameDetail, gender, contact, location, job, dates } = props;
    return (
        <div className="hcard-summary">
            <Row alignment={HorizontalAlignment.SpaceBetween}>
                <Name name={name} detail={nameDetail} />
            </Row>
            <Row>
                <Gender {...gender} />
                <Location {...location} />
            </Row>
            <Row>
                <InlineGroup>
                    <PropertyUriDiv
                        href={contact.url}
                        cls={Microformats.U_Url}
                        value={contact.url}
                    />
                </InlineGroup>
                <Dates {...dates} />
            </Row>
        </div>
    );
};

const HCardTextDetail = (props: HCardData) => {
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
    } = props;

    return (
        <div className="hcard-detail">
            <NameDetail name={name} detail={nameDetail} />
        </div>
    );
};
