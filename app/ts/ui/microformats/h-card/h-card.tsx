import React, { useContext } from "react";
import { _ } from "ts/compat";
import { HCardData } from "ts/data/types";
import { EmbeddedHCard as EmbeddedHCardData } from "ts/data/types/h-card";
import { Column, Row, Space } from "ts/ui/layout";
import { Dialog, DialogProps } from "ts/ui/layout/dialog";
import { ExpandableDefaultProps } from "ts/ui/layout/expand-collapse";
import { ExpandableCard } from "ts/ui/layout/expandable-card";
import { Avatar } from "ts/ui/microformats/h-card/avatar";
import {
    ContactSummary,
    ContactPropertiesTable,
} from "ts/ui/microformats/h-card/contact";
import { DatesPropertiesTable } from "ts/ui/microformats/h-card/dates";
import { ExtrasPropertiesTable } from "ts/ui/microformats/h-card/extras";
import {
    GenderSummary,
    GenderPropertiesTable,
} from "ts/ui/microformats/h-card/gender";
import { JobSummary, JobPropertiesTable } from "ts/ui/microformats/h-card/job";
import {
    LocationPropertiesTable,
    LocationProperty,
} from "ts/ui/microformats/common";
import { Name, NamePropertiesTable } from "./name";
import { Microformat } from "ts/data/microformats";
import {
    DetailSection,
    displayValueProperties,
    PropertiesTable,
    PropertyColumn,
} from "ts/ui/microformats/common";
import { OptionsContext } from "ts/options";
import { allOf, anyOf } from "ts/data/util/arrays";

export const HCard = (props: HCardData & ExpandableDefaultProps) => {
    const { defaultIsExpanded, images } = props;

    return (
        <ExpandableCard
            microformat={Microformat.H.Card}
            expandable={shouldShowDetail(props)}
            defaultIsExpanded={defaultIsExpanded}
            sharedContent={
                <Avatar name={props.name?.[0] ?? "?"} images={images} />
            }
            summaryContent={<HCardTextSummary {...props} />}
            detailContent={<HCardTextDetail {...props} />}
        />
    );
};

const shouldShowDetail = (data: HCardData): boolean => {
    const { contact, location, job, nameDetail, gender, extras, dates } = data;

    return anyOf([
        contact,
        location,
        allOf([job?.jobTitle, job?.role]) ? true : null,
        nameDetail,
        gender,
        extras,
        dates,
    ]);
};

export const EmbeddedHCardDialog = (props: EmbeddedHCardData & DialogProps) => {
    const { hcard, open, onClose } = props;

    if (hcard == null) return null;
    if (!open) return null;

    return (
        <Dialog
            id={`hcard_${hcard.id}`}
            className={Microformat.H.Card}
            title={Microformat.H.Card}
            open={open}
            onClose={onClose}
        >
            <HCard {...hcard} />
        </Dialog>
    );
};

const HCardTextSummary = (props: HCardData) => {
    const { name, notes, gender, contact, location, job } = props;
    return (
        <div className="hcard-summary">
            <Name name={name} />

            <Row wrap space={Space.Medium} verticalSpace={Space.None}>
                <GenderSummary data={gender} />
                <ContactSummary data={contact} />
            </Row>

            <Row wrap space={Space.Medium} verticalSpace={Space.None}>
                <LocationProperty
                    microformat={Microformat.P.Adr}
                    locations={location}
                />
                <JobSummary data={job} />
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
    } = props;

    const options = useContext(OptionsContext);

    return (
        <div className="hcard-detail">
            <Column space={Space.Medium} spaceAround>
                <Name name={name} />
                <Notes notes={notes} />
            </Column>

            <PropertiesTable>
                <DetailSection
                    options={options}
                    sectionTitle={_("hcard_name_details")}
                    dependsOn={nameDetail}
                    render={data => <NamePropertiesTable data={data} />}
                />
                <DetailSection
                    options={options}
                    sectionTitle={_("hcard_gender_details")}
                    dependsOn={gender}
                    render={data => <GenderPropertiesTable data={data} />}
                />

                <DetailSection
                    options={options}
                    sectionTitle={_("hcard_contact_detail")}
                    dependsOn={contact}
                    render={data => <ContactPropertiesTable data={data} />}
                />

                <DetailSection
                    options={options}
                    sectionTitle={_("hcard_location_detail")}
                    dependsOn={location}
                    render={data => {
                        return (
                            <>
                                {data.map((it, index) => (
                                    <LocationPropertiesTable
                                        key={index}
                                        data={it}
                                    />
                                ))}
                            </>
                        );
                    }}
                />

                <DetailSection
                    options={options}
                    sectionTitle={_("hcard_job_detail")}
                    dependsOn={job}
                    render={data => <JobPropertiesTable data={data} />}
                />

                <DetailSection
                    options={options}
                    sectionTitle={_("hcard_dates_detail")}
                    dependsOn={dates}
                    render={data => <DatesPropertiesTable data={data} />}
                />

                <DetailSection
                    options={options}
                    sectionTitle={_("hcard_extras_detail")}
                    dependsOn={extras}
                    render={data => <ExtrasPropertiesTable data={data} />}
                />
            </PropertiesTable>
        </div>
    );
};

const Notes = (props: { notes: string[] | null | undefined }) => {
    const { notes } = props;
    if (!notes) return null;
    return (
        <PropertyColumn
            microformat={Microformat.P.Note}
            values={displayValueProperties(notes)}
        />
    );
};
