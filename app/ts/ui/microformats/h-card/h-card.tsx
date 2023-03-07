import React, { HTMLProps } from "react";
import { _ } from "ts/compat";
import { HCardData } from "ts/data/types";
import { EmbeddedHCard as EmbeddedHCardData } from "ts/data/types/h-card";
import { Row } from "ts/ui/layout";
import { CardContent, CardLayout } from "ts/ui/layout/card";
import { Dropdown } from "ts/ui/layout/dropdown";
import { ExpandableDefaultProps } from "ts/ui/layout/expand-collapse";
import { ExpandableCard } from "ts/ui/layout/expandable-card";
import { Avatar } from "ts/ui/microformats/h-card/avatar";
import {
    Contact,
    ContactPropertiesTable,
} from "ts/ui/microformats/h-card/contact";
import { DatesPropertiesTable } from "ts/ui/microformats/h-card/dates";
import { ExtrasPropertiesTable } from "ts/ui/microformats/h-card/extras";
import {
    Gender,
    GenderPropertiesTable,
} from "ts/ui/microformats/h-card/gender";
import { Job, JobPropertiesTable } from "ts/ui/microformats/h-card/job";
import { OpenProps } from "ts/ui/types";
import { Location, LocationPropertiesTable } from "./location";
import { Name, NamePropertiesTable } from "./name";
import "./hcard.scss";

export const HCard = (props: HCardData & ExpandableDefaultProps) => {
    const { defaultIsExpanded, images } = props;

    return (
        <ExpandableCard
            defaultIsExpanded={defaultIsExpanded}
            className="h-card"
            contentDescription="h-card"
            sharedContent={<Avatar name={props.name ?? "?"} images={images} />}
            summaryContent={<HCardTextSummary {...props} />}
            detailContent={<HCardTextDetail {...props} />}
        />
    );
};

export const EmbeddedHCardDialog = (props: EmbeddedHCardData & OpenProps) => {
    const { id, hcard, isOpen } = props;

    if (hcard == null) return null;

    return (
        <dialog id={`hcard_${id}`} open={isOpen}>
            <CardLayout>
                <CardContent>
                    <HCardTextSummary {...hcard} />
                </CardContent>
            </CardLayout>
        </dialog>
    );
};

const HCardTextSummary = (props: HCardData) => {
    const {
        name,
        nameDetail,
        gender,
        contact,
        location,
        images,
        job,
        dates,
        extras,
        ...rest
    } = props;
    return (
        <div className="hcard-summary" {...rest}>
            <Name name={name} />

            <Row wrap>
                <Gender data={gender} />
                <Contact data={contact} />
            </Row>

            <Row wrap>
                <Location data={location} />
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
            <Name name={name} />

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
