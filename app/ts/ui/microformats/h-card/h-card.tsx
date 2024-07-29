import React, { HTMLProps, ReactElement, ReactNode, useContext } from "react";
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
                render={data => <NamePropertiesTable data={data} />}
            />

            <DetailSection
                sectionTitle={_("hcard_gender_details")}
                dependsOn={gender}
                render={data => <GenderPropertiesTable data={data} />}
            />

            <DetailSection
                sectionTitle={_("hcard_contact_detail")}
                dependsOn={contact}
                render={data => <ContactPropertiesTable data={data} />}
            />

            <DetailSection
                sectionTitle={_("hcard_location_detail")}
                dependsOn={location}
                render={data => <LocationPropertiesTable data={data} />}
            />

            <DetailSection
                sectionTitle={_("hcard_job_detail")}
                dependsOn={job}
                render={data => <JobPropertiesTable data={data} />}
            />

            <DetailSection
                sectionTitle={_("hcard_dates_detail")}
                dependsOn={dates}
                render={data => <DatesPropertiesTable data={data} />}
            />

            <DetailSection
                sectionTitle={_("hcard_extras_detail")}
                dependsOn={extras}
                render={data => <ExtrasPropertiesTable data={data} />}
            />
        </div>
    );
};

interface RequiredObjectProps<T> {
    sectionTitle: string;
    dependsOn: T | null;
    render: (data: T) => ReactElement;
}
const DetailSection = <T extends any>(
    props: Omit<HTMLProps<HTMLDivElement>, "children"> & RequiredObjectProps<T>,
) => {
    const { render, sectionTitle, dependsOn, className, ...rest } = props;
    if (dependsOn == null) return null;

    const renderedContent = render(dependsOn);

    const options = useContext(OptionsContext);
    if (options.groupByType) {
        return (
            <Dropdown
                defaultIsExpanded={options.dropdownExpandByDefault}
                header={<span>{sectionTitle}</span>}
                title={sectionTitle}
                className={className}
                children={renderedContent}
                {...rest}
            />
        );
    } else {
        return <>{renderedContent}</>;
    }
};

const Notes = (props: { notes: string[] | null | undefined }) => {
    const { notes } = props;
    if (!notes) return null;
    return <Property microformat={Microformat.P.Note} displayValue={notes} />;
};
