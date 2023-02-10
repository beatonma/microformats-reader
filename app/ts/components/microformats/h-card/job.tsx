import React from "react";
import {_} from "ts/compat";
import {Icons} from "ts/components/icon";
import {ConditionalContent} from "ts/components/layout/conditional";
import {InlineGroup} from "ts/components/layout/inline-group";
import {PropertiesTable, Property, PropertyRow,} from "ts/components/microformats/properties";
import {PropsOf} from "ts/components/props";
import {Microformats} from "ts/data/microformats";
import {HCardJobData} from "ts/data/types/h-card";

export const Job = (props: PropsOf<HCardJobData>) => {
    const job = props.data;
    if (!job) return null;
    const { jobTitle, orgHCard } = job;

    return (
        <InlineGroup>
            <Property
                cls={Microformats.P_Job_Title}
                icon={Icons.Work}
                value={jobTitle}
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
                cls={Microformats.P_Job_Title}
                name={_("hcard_job_title")}
                value={jobTitle}
            />
            <PropertyRow
                cls={Microformats.P_Role}
                name={_("hcard_job_role")}
                value={role}
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
                name={_("hcard_job_organisation")}
                title={_("hcard_link_to_org_hcard")}
                href={`#${orgHCard.id}`}
                cls={Microformats.P_Org}
                value={orgName}
            />
        );
    } else {
        return (
            <PropertyRow
                name={_("hcard_job_organisation")}
                cls={Microformats.P_Org}
                value={orgName}
            />
        );
    }
};

const LinkToOrganisation = (props: HCardJobData) => {
    const { orgName, orgHCard } = props;

    if (orgHCard) {
        return (
            <Property
                href={`#${orgHCard.id}`}
                cls={Microformats.P_Org}
                title={_("hcard_link_to_org_hcard")}
                value={orgHCard.name}
            />
        );
    }

    if (orgName) {
        return <Property cls={Microformats.P_Org} value={orgName} />;
    }

    return null;
};
