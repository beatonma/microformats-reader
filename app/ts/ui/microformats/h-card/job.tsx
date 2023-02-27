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
    const { jobTitle, orgHCard } = job;

    return (
        <InlineGroup>
            <Property
                microformat={Microformat.P.Job_Title}
                icon={Icons.Work}
                displayValue={jobTitle}
            />
            <ConditionalContent condition={() => !!jobTitle && !!orgHCard}>
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
    const { orgName, orgHCard } = props;

    if (orgHCard) {
        return (
            <PropertyRow
                displayName={_("hcard_job_organisation")}
                title={_("hcard_link_to_org_hcard")}
                href={`#${orgHCard.id}`}
                microformat={Microformat.P.Org}
                displayValue={orgName}
            />
        );
    } else {
        return (
            <PropertyRow
                displayName={_("hcard_job_organisation")}
                microformat={Microformat.P.Org}
                displayValue={orgName}
            />
        );
    }
};

const LinkToOrganisation = (props: HCardJobData) => {
    const { jobTitle, orgName, orgHCard } = props;

    const icon = jobTitle ? undefined : Icons.Work;

    if (orgHCard) {
        return (
            <Property
                icon={icon}
                href={`#${orgHCard.id}`}
                microformat={Microformat.P.Org}
                title={_("hcard_link_to_org_hcard")}
                displayValue={orgHCard.name}
            />
        );
    }

    if (orgName) {
        return (
            <Property
                icon={icon}
                microformat={Microformat.P.Org}
                displayValue={orgName}
            />
        );
    }

    return null;
};
