import React, { useId, useState } from "react";
import { _ } from "ts/compat";
import { HorizontalAlignment, Row } from "ts/components/layout";
import {
    Dropdown,
    DropdownIcon,
    DropdownProps,
    ExpandableDefaultProps,
} from "ts/components/layout/dropdown";
import { Avatar } from "ts/components/microformats/h-card/avatar";
import {
    Contact,
    ContactPropertiesTable,
} from "ts/components/microformats/h-card/contact";
import { DatesPropertiesTable } from "ts/components/microformats/h-card/dates";
import { ExtrasPropertiesTable } from "ts/components/microformats/h-card/extras";
import {
    Gender,
    GenderPropertiesTable,
} from "ts/components/microformats/h-card/gender";
import { Job, JobPropertiesTable } from "ts/components/microformats/h-card/job";
import { HCardData } from "ts/data/h-card";
import { Location, LocationPropertiesTable } from "./location";
import { Name, NamePropertiesTable } from "./name";
import "./hcard.scss";

export const HCard = (props: HCardData & ExpandableDefaultProps) => {
    const { defaultIsExpanded, id, images, ...rest } = props;
    const [isExpanded, setExpanded] = useState(defaultIsExpanded ?? false);
    const [isInteractedWith, setIsInteractedWith] = useState(false);
    const hcardContentID = useId();

    const toggleExpanded = () => {
        setExpanded(!isExpanded);
        setIsInteractedWith(true);
    };

    return (
        <div className="hcard-wrapper" id={id}>
            <div
                id={hcardContentID}
                className="h-card"
                data-expanded={isExpanded}
                aria-expanded={isExpanded}
                data-is-interacted-with={isInteractedWith}
            >
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
            <button
                id="hcard_toggle_detail"
                onClick={toggleExpanded}
                aria-controls={hcardContentID}
            >
                <DropdownIcon isExpanded={isExpanded} />
            </button>
        </div>
    );
};

const HCardTextSummary = (props: HCardData) => {
    const { name, nameDetail, gender, contact, location, job } = props;
    return (
        <div className="hcard-summary">
            <Row alignment={HorizontalAlignment.SpaceBetween}>
                <Name name={name} detail={nameDetail} />
            </Row>
            <Row wrap>
                <Gender {...gender} />
                <Location {...location} />
            </Row>
            <Row wrap>
                <Contact {...contact} />
                <Job {...job} />
            </Row>
        </div>
    );
};

const HCardTextDetail = (props: HCardData) => {
    const { name, nameDetail, gender, contact, location, job, dates, extras } =
        props;

    return (
        <div className="hcard-detail">
            <Row alignment={HorizontalAlignment.Center}>
                <Name name={name} />
            </Row>

            <DetailSection
                header={_("hcard_name_details")}
                dependsOn={nameDetail}
            >
                <NamePropertiesTable detail={nameDetail} />
            </DetailSection>

            <DetailSection
                header={_("hcard_gender_details")}
                dependsOn={gender}
            >
                <GenderPropertiesTable {...gender} />
            </DetailSection>

            <DetailSection
                header={_("hcard_contact_detail")}
                dependsOn={contact}
            >
                <ContactPropertiesTable {...contact} />
            </DetailSection>

            <DetailSection
                header={_("hcard_location_detail")}
                dependsOn={location}
            >
                <LocationPropertiesTable {...location} />
            </DetailSection>

            <DetailSection header={_("hcard_job_detail")} dependsOn={job}>
                <JobPropertiesTable {...job} />
            </DetailSection>

            <DetailSection header={_("hcard_dates_detail")} dependsOn={dates}>
                <DatesPropertiesTable {...dates} />
            </DetailSection>

            <DetailSection header={_("hcard_extras_detail")} dependsOn={extras}>
                <ExtrasPropertiesTable {...extras} />
            </DetailSection>
        </div>
    );
};

interface RequiredObjectProps {
    dependsOn: object;
}
const DetailSection = (props: DropdownProps & RequiredObjectProps) => {
    if (props.dependsOn == null) return null;

    return <Dropdown {...props} />;
};
