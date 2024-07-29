import React, { HTMLProps, useContext } from "react";
import { _ } from "ts/compat";
import { HCardData } from "ts/data/types";
import { EmbeddedHCard as EmbeddedHCardData } from "ts/data/types/h-card";
import { Column, Row, Space } from "ts/ui/layout";
import { CardContent, CardLayout } from "ts/ui/layout/card";
import { Dialog, DialogProps } from "ts/ui/layout/dialog";
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
import { Location, LocationPropertiesTable } from "./location";
import { Name, NamePropertiesTable } from "./name";
import { Microformat } from "ts/data/microformats";
import { Property } from "ts/ui/microformats/common/properties";
import { OptionsContext } from "ts/options";
import { classes } from "ts/ui/util";

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

export const EmbeddedHCardDialog = (props: EmbeddedHCardData & DialogProps) => {
    const { id, hcard, open, onClose } = props;

    if (hcard == null) return null;

    return (
        <Dialog id={`hcard_${id}`} open={open} onClose={onClose}>
            <CardLayout>
                <CardContent>
                    <HCardTextSummary {...hcard} />
                </CardContent>
            </CardLayout>
        </Dialog>
    );
};

const HCardTextSummary = (props: HCardData) => {
    const {
        name,
        notes,
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

            <Row wrap space={Space.Small}>
                <Gender data={gender} />
                <Contact data={contact} />
            </Row>

            <Row wrap space={Space.Small}>
                <Location data={location} />
                <Job data={job} />
            </Row>

            <Notes notes={notes} />
        </div>
    );
};

const HCardTextDetail = (props: HCardData) => {
    const {
        name,
        notes,
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
            <Column space={Space.Medium} spaceAround>
                <Name name={name} />
                <Notes notes={notes} />
            </Column>

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
    props: HTMLProps<HTMLDivElement> & RequiredObjectProps,
) => {
    const { sectionTitle, dependsOn, className, ...rest } = props;
    if (dependsOn == null) return null;

    const options = useContext(OptionsContext);
    if (options.groupByType) {
        return (
            <Dropdown
                defaultIsExpanded={options.dropdownExpandByDefault}
                header={<span>{sectionTitle}</span>}
                title={sectionTitle}
                className={className}
                {...rest}
            />
        );
    } else {
        return (
            <div
                className={classes(className, "detail-section--no-dropdown")}
                {...rest}
            />
        );
    }
};

const Notes = (props: { notes: string[] | null | undefined }) => {
    const { notes } = props;
    if (!notes) return null;
    return <Property microformat={Microformat.P.Note} displayValue={notes} />;
};
