import React, { HTMLProps, useState } from "react";
import { _ } from "ts/compat";
import { HorizontalAlignment, Row } from "ts/components/layout";
import {
    Dropdown,
    DropdownButton,
    DropdownProps,
    ExpandableDefaultProps,
} from "ts/components/layout/dropdown";
import { InlineGroup } from "ts/components/layout/inline-group";
import { Avatar } from "ts/components/microformats/h-card/avatar";
import {
    Contact,
    ContactPropertiesTable,
} from "ts/components/microformats/h-card/contact";
import { Dates } from "ts/components/microformats/h-card/dates";
import {
    Gender,
    GenderPropertiesTable,
} from "ts/components/microformats/h-card/gender";
import { PropertyLinkDiv } from "ts/components/microformats/properties";
import { HCardRaw } from "ts/components/microformats/raw";
import { HCardData } from "ts/data/h-card";
import { Microformats } from "ts/data/microformats";
import { Todo } from "ts/dev";
import { Location } from "./location";
import { Name, NamePropertiesTable } from "./name";
import "./hcard.scss";

export const HCard = (props: HCardData & ExpandableDefaultProps) => {
    const { defaultIsExpanded, images, ...rest } = props;
    const [isExpanded, setExpanded] = useState(defaultIsExpanded ?? true);

    const toggleExpanded = () => setExpanded(!isExpanded);

    return (
        <div className="hcard-wrapper">
            <div className="h-card" data-expanded={isExpanded}>
                <Row className="banner">
                    <Avatar
                        name={props.name}
                        {...images}
                        onClick={toggleExpanded}
                    />
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
                <Contact {...contact} />
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
            <Row alignment={HorizontalAlignment.Center}>
                <Name name={name} />
            </Row>

            <DetailSection
                header={_("hcard_name_details")}
                defaultIsExpanded={true}
            >
                <NamePropertiesTable name={name} detail={nameDetail} />
            </DetailSection>

            <DetailSection header={_("hcard_gender_details")}>
                <GenderPropertiesTable {...gender} />
            </DetailSection>

            <DetailSection header={_("hcard_contact_detail")}>
                <ContactPropertiesTable {...contact} />
            </DetailSection>

            <DetailSection header={_("hcard_location_detail")}>
                <Todo />
            </DetailSection>

            <DetailSection header={_("hcard_job_detail")}>
                <Todo />
            </DetailSection>

            <HCardRaw {...props} />
        </div>
    );
};

const DetailSection = (props: DropdownProps) => <Dropdown {...props} />;
