import React from "react";
import { _ } from "ts/compat";
import { Microformat } from "ts/data/microformats";
import { HCardJobData } from "ts/data/types/h-card";
import { Icons } from "ts/ui/icon";
import { ConditionalContent } from "ts/ui/layout/conditional";
import { InlineGroup } from "ts/ui/layout/inline-group";
import {
    PropertiesTable,
    Property,
    PropertyRow,
} from "ts/ui/microformats/properties";
import { PropsOf } from "ts/ui/props";

export const Job = (props: PropsOf<HCardJobData>) => {
    const job = props.data;
    if (!job) return null;
    const { jobTitle, organisation } = job;

    return (
        <InlineGroup>
            <Property
                microformat={Microformat.P.Job_Title}
                icon={Icons.Work}
                displayValue={jobTitle}
            />
            <ConditionalContent condition={() => !!jobTitle && !!organisation}>
                <span>{" @ "}</span>
            </ConditionalContent>
            <LinkToOrganisation {...job} />
        </InlineGroup>
    );
};

export const JobPropertiesTable = (props: PropsOf<HCardJobData>) => {
    const job = props.data;
    if (!job) return null;
    const { jobTitle, role } = job;

    return (
        <PropertiesTable>
            <PropertyRow
                microformat={Microformat.P.Job_Title}
                displayName={_("hcard_job_title")}
                displayValue={jobTitle}
            />
            <PropertyRow
                microformat={Microformat.P.Role}
                displayName={_("hcard_job_role")}
                displayValue={role}
            />
            <Organisation {...job} />
        </PropertiesTable>
    );
};

const Organisation = (props: HCardJobData) => {
    const { organisation } = props;

    return (
        <PropertyRow
            microformat={Microformat.P.Org}
            href={`#${organisation?.id}`}
            title={_("hcard_link_to_org_hcard")}
            displayName={_("hcard_job_organisation")}
            displayValue={organisation?.name}
        />
    );
};

const LinkToOrganisation = (props: HCardJobData) => {
    const { jobTitle, organisation } = props;

    if (organisation == null) return null;
    const { name, hcard } = organisation;

    const icon = jobTitle ? undefined : Icons.Work;

    return (
        <Property
            icon={icon}
            href={hcard == null ? null : `#${hcard.id}`}
            microformat={Microformat.P.Org}
            title={_("hcard_link_to_org_hcard")}
            displayValue={name}
        />
    );
};
