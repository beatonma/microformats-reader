import React, { useState } from "react";
import { _ } from "ts/compat";
import { Microformat } from "ts/data/microformats";
import { HCardJobData } from "ts/data/types/h-card";
import { Icons } from "ts/ui/icon";
import { Row, Space } from "ts/ui/layout";
import { ConditionalContent } from "ts/ui/layout/conditional";
import {
    PropertiesTable,
    PropertyRow,
} from "ts/ui/microformats/common/properties";
import { NullablePropsOf, PropsOf } from "ts/ui/props";
import { EmbeddedHCardDialog } from "ts/ui/microformats/h-card/h-card";

export const Job = (props: NullablePropsOf<HCardJobData>) => {
    const job = props.data;
    if (!job) return null;
    const { jobTitle, organisation } = job;

    return (
        <Row space={Space.Char}>
            <PropertyRow
                microformat={Microformat.P.Job_Title}
                icon={Icons.Work}
                displayValue={jobTitle}
            />
            <ConditionalContent condition={() => !!jobTitle && !!organisation}>
                <span>@</span>
            </ConditionalContent>
            <LinkToOrganisation {...job} />
        </Row>
    );
};

export const JobPropertiesTable = (
    props: PropsOf<HCardJobData> & PropertiesTable.TableProps,
) => {
    const [isHcardOpen, setIsHcardOpen] = useState(false);
    const { jobTitle, role, organisation } = props.data;

    return (
        <PropertiesTable.Table inlineTableData={props.inlineTableData}>
            <PropertiesTable.PropertyRow
                microformat={Microformat.P.Job_Title}
                displayName={_("hcard_job_title")}
                displayValue={jobTitle}
            />
            <PropertiesTable.PropertyRow
                microformat={Microformat.P.Role}
                displayName={_("hcard_job_role")}
                displayValue={role}
            />
            <PropertiesTable.PropertyRow
                microformat={Microformat.P.Org}
                title={_("hcard_link_to_org_hcard")}
                displayName={_("hcard_job_organisation")}
                displayValue={organisation?.name}
                onClick={() => setIsHcardOpen(true)}
            />
            {organisation ? (
                <EmbeddedHCardDialog
                    id={organisation.id}
                    name={organisation.name}
                    hcard={organisation.hcard}
                    open={isHcardOpen}
                    onClose={() => setIsHcardOpen(false)}
                />
            ) : null}
        </PropertiesTable.Table>
    );
};

const LinkToOrganisation = (props: HCardJobData) => {
    const [isOpen, setIsOpen] = useState(false);
    const { jobTitle, organisation } = props;

    if (organisation == null) return null;
    const { id, name, hcard } = organisation;

    const icon = jobTitle ? undefined : Icons.Work;

    return (
        <>
            <PropertyRow
                icon={icon}
                microformat={Microformat.P.Org}
                title={_("hcard_link_to_org_hcard")}
                displayValue={name}
                onClick={hcard == null ? undefined : () => setIsOpen(true)}
            />

            <EmbeddedHCardDialog
                id={id}
                hcard={hcard}
                name={name}
                open={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
};
