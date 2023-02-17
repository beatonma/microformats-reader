import React from "react";
import { _ } from "ts/compat";
import { Icons } from "ts/components/icon";
import { ConditionalContent } from "ts/components/layout/conditional";
import { InlineGroup } from "ts/components/layout/inline-group";
import {
    PropertiesTable,
    Property,
    PropertyRow,
} from "ts/components/microformats/properties";
import { PropsOf } from "ts/components/props";
import { Microformat } from "ts/data/microformats";
import { HCardJobData } from "ts/data/types/h-card";

export const Job = (props: PropsOf<HCardJobData>) => {
    const job = props.data;
    if (!job) return null;
    const { jobTitle, orgHCard } = job;

    return (
        <InlineGroup>
            <Property
                microformat={Microformat.PlainProp.P_Job_Title}
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
                microformat={Microformat.PlainProp.P_Job_Title}
                displayName={_("hcard_job_title")}
                displayValue={jobTitle}
            />
            <PropertyRow
                microformat={Microformat.PlainProp.P_Role}
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
                microformat={Microformat.PlainProp.P_Org}
                displayValue={orgName}
            />
        );
    } else {
        return (
            <PropertyRow
                displayName={_("hcard_job_organisation")}
                microformat={Microformat.PlainProp.P_Org}
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
                microformat={Microformat.PlainProp.P_Org}
                title={_("hcard_link_to_org_hcard")}
                displayValue={orgHCard.name}
            />
        );
    }

    if (orgName) {
        return (
            <Property
                icon={icon}
                microformat={Microformat.PlainProp.P_Org}
                displayValue={orgName}
            />
        );
    }

    return null;
};
