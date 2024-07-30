import React, { HTMLProps, ReactElement, useContext } from "react";
import { _ } from "ts/compat";
import { HCardData } from "ts/data/types";
import { EmbeddedHCard as EmbeddedHCardData } from "ts/data/types/h-card";
import { Alignment, Column, Row, Space } from "ts/ui/layout";
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
import {
    PropertiesTable,
    PropertyColumn,
} from "ts/ui/microformats/common/properties";
import { AppOptions, OptionsContext } from "ts/options";

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
    const { hcard, open, onClose } = props;

    if (hcard == null) return null;

    return (
        <Dialog
            id={`hcard_${hcard.id}`}
            className="h-card"
            open={open}
            onClose={onClose}
        >
            <CardLayout>
                <CardContent>
                    <Row vertical={Alignment.Start} space={Space.Large}>
                        <Avatar
                            name={hcard.name ?? "?"}
                            images={hcard.images}
                        />
                        <HCardTextSummary {...hcard} />
                    </Row>
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

    const options = useContext(OptionsContext);
    const inlineTableData = !options.groupByType;

    return (
        <div className="hcard-detail" {...rest}>
            <Column space={Space.Medium} spaceAround>
                <Name name={name} />
                <Notes notes={notes} />
            </Column>

            <PropertiesTable.Table inlineTableData={!inlineTableData}>
                <DetailSection
                    options={options}
                    sectionTitle={_("hcard_name_details")}
                    dependsOn={nameDetail}
                    render={data => (
                        <NamePropertiesTable
                            data={data}
                            inlineTableData={inlineTableData}
                        />
                    )}
                />
                <DetailSection
                    options={options}
                    sectionTitle={_("hcard_gender_details")}
                    dependsOn={gender}
                    render={data => (
                        <GenderPropertiesTable
                            data={data}
                            inlineTableData={inlineTableData}
                        />
                    )}
                />

                <DetailSection
                    options={options}
                    sectionTitle={_("hcard_contact_detail")}
                    dependsOn={contact}
                    render={data => (
                        <ContactPropertiesTable
                            data={data}
                            inlineTableData={inlineTableData}
                        />
                    )}
                />

                <DetailSection
                    options={options}
                    sectionTitle={_("hcard_location_detail")}
                    dependsOn={location}
                    render={data => (
                        <LocationPropertiesTable
                            data={data}
                            inlineTableData={inlineTableData}
                        />
                    )}
                />

                <DetailSection
                    options={options}
                    sectionTitle={_("hcard_job_detail")}
                    dependsOn={job}
                    render={data => (
                        <JobPropertiesTable
                            data={data}
                            inlineTableData={inlineTableData}
                        />
                    )}
                />

                <DetailSection
                    options={options}
                    sectionTitle={_("hcard_dates_detail")}
                    dependsOn={dates}
                    render={data => (
                        <DatesPropertiesTable
                            data={data}
                            inlineTableData={inlineTableData}
                        />
                    )}
                />

                <DetailSection
                    options={options}
                    sectionTitle={_("hcard_extras_detail")}
                    dependsOn={extras}
                    render={data => (
                        <ExtrasPropertiesTable
                            data={data}
                            inlineTableData={inlineTableData}
                        />
                    )}
                />
            </PropertiesTable.Table>
        </div>
    );
};

interface RequiredObjectProps<T> {
    options: AppOptions;
    sectionTitle: string;
    dependsOn: T | null;
    render: (data: T) => ReactElement;
}
const DetailSection = <T extends any>(
    props: Omit<HTMLProps<HTMLDivElement>, "children"> & RequiredObjectProps<T>,
) => {
    const { options, render, sectionTitle, dependsOn, className, ...rest } =
        props;
    if (dependsOn == null) return null;

    const renderedContent = render(dependsOn);
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
    return (
        <PropertyColumn microformat={Microformat.P.Note} displayValue={notes} />
    );
};
