import React, { HTMLProps, useEffect, useId, useState } from "react";
import { _ } from "ts/compat";
import { HorizontalAlignment, Row } from "ts/components/layout";
import { CardContent, CardLayout } from "ts/components/layout/card";
import { Dropdown, DropdownButton } from "ts/components/layout/dropdown";
import { ExpandableDefaultProps } from "ts/components/layout/expand-collapse";
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
import { HCardData } from "ts/data/types";
import { Location, LocationPropertiesTable } from "./location";
import { Name, NamePropertiesTable } from "./name";
import "./hcard.scss";

export const HCard = (props: HCardData & ExpandableDefaultProps) => {
    const { defaultIsExpanded, id, images } = props;
    const [isExpanded, setExpanded] = useState(defaultIsExpanded ?? false);
    const [isCollapsing, setIsCollapsing] = useState(false);
    const [isExpanding, setIsExpanding] = useState(false);
    const hcardContentID = useId();
    const summaryID = useId();
    const detailID = useId();

    const toggleExpanded = () => {
        const target = !isExpanded;
        setExpanded(target);
        setIsExpanding(target);
        setIsCollapsing(!target);
    };

    addAnimationEndListener(summaryID, isExpanding, () =>
        setIsExpanding(false)
    );
    addAnimationEndListener(detailID, isCollapsing, () =>
        setIsCollapsing(false)
    );

    return (
        <CardLayout id={id}>
            <CardContent
                id={hcardContentID}
                className="h-card"
                data-expanded={isExpanded}
                data-expanding={isExpanding}
                data-collapsing={isCollapsing}
                aria-expanded={isExpanded}
            >
                <Row className="banner">
                    <Avatar
                        name={props.name ?? "?"}
                        images={images}
                        onClick={toggleExpanded}
                    />
                    <HCardTextSummary
                        {...props}
                        id={summaryID}
                        data-visible={!isExpanded}
                        data-closing={isExpanding}
                    />
                </Row>

                <DropdownButton
                    title="h-card"
                    id="hcard_toggle_detail"
                    isExpanded={isExpanded}
                    onClick={toggleExpanded}
                    aria-controls={hcardContentID}
                />

                <HCardTextDetail
                    {...props}
                    id={detailID}
                    data-visible={isExpanded}
                    data-closing={isCollapsing}
                />
            </CardContent>
        </CardLayout>
    );
};

const addAnimationEndListener = (
    id: string,
    isCollapsing: boolean,
    reset: () => void
) => {
    useEffect(() => {
        if (isCollapsing) {
            document.getElementById(id)?.addEventListener(
                "animationend",
                () => {
                    reset();
                },
                {
                    once: true,
                }
            );
        }
    }, [isCollapsing]);
};

const HCardTextSummary = (props: HCardData) => {
    const {
        name,
        nameDetail,
        gender,
        contact,
        location,
        job,
        dates,
        extras,
        ...rest
    } = props;
    return (
        <div className="hcard-summary" {...rest}>
            <Row alignment={HorizontalAlignment.SpaceBetween}>
                <Name name={name} />
            </Row>

            <Row wrap>
                <Gender data={gender} />
                <Location data={location} />
            </Row>

            <Row wrap>
                <Contact data={contact} />
                <Job data={job} />
            </Row>
        </div>
    );
};

const HCardTextDetail = (props: HCardData) => {
    const {
        name,
        nameDetail,
        gender,
        contact,
        location,
        job,
        dates,
        extras,
        ...rest
    } = props;

    return (
        <div className="hcard-detail" {...rest}>
            <Row alignment={HorizontalAlignment.Center}>
                <Name name={name} />
            </Row>

            <DetailSection
                sectionTitle={_("hcard_name_details")}
                dependsOn={nameDetail}
            >
                <NamePropertiesTable data={nameDetail} />
            </DetailSection>

            <DetailSection
                sectionTitle={_("hcard_gender_details")}
                dependsOn={gender}
            >
                <GenderPropertiesTable data={gender} />
            </DetailSection>

            <DetailSection
                sectionTitle={_("hcard_contact_detail")}
                dependsOn={contact}
            >
                <ContactPropertiesTable data={contact} />
            </DetailSection>

            <DetailSection
                sectionTitle={_("hcard_location_detail")}
                dependsOn={location}
            >
                <LocationPropertiesTable data={location} />
            </DetailSection>

            <DetailSection sectionTitle={_("hcard_job_detail")} dependsOn={job}>
                <JobPropertiesTable data={job} />
            </DetailSection>

            <DetailSection
                sectionTitle={_("hcard_dates_detail")}
                dependsOn={dates}
            >
                <DatesPropertiesTable data={dates} />
            </DetailSection>

            <DetailSection
                sectionTitle={_("hcard_extras_detail")}
                dependsOn={extras}
            >
                <ExtrasPropertiesTable data={extras} />
            </DetailSection>
        </div>
    );
};

interface RequiredObjectProps {
    sectionTitle: string;
    dependsOn: unknown;
}
const DetailSection = (
    props: HTMLProps<HTMLDivElement> & RequiredObjectProps
) => {
    const { sectionTitle, dependsOn, ...rest } = props;
    if (dependsOn == null) return null;

    return (
        <Dropdown
            header={<span>{sectionTitle}</span>}
            title={sectionTitle}
            {...rest}
        />
    );
};
