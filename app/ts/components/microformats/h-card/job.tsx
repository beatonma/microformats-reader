import React from "react";
import { _ } from "ts/compat";
import { Icons } from "ts/components/icons";
import { ConditionalContent } from "ts/components/layout/conditional";
import { InlineGroup } from "ts/components/layout/inline-group";
import {
    PropertiesTable,
    PropertyRow,
    PropertyRowLink,
} from "ts/components/microformats/properties";
import { HCardJobData } from "ts/data/h-card";
import { Microformats } from "ts/data/microformats";

export const Job = (props?: HCardJobData) => {
    if (!props) return null;
    const { jobTitle, orgHCard } = props;

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
            <LinkToOrganisation {...props} />
        </InlineGroup>
    );
};

export const JobPropertiesTable = (props?: HCardJobData) => {
    if (!props) return null;
    const { jobTitle, role } = props;

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
            <Organisation {...props} />
        </PropertiesTable>
    );
};

const Organisation = (props: HCardJobData) => {
    const { orgName, orgHCard } = props;

    if (orgHCard) {
        return (
            <PropertyRowLink
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
        return (
            <Property
                cls={Microformats.P_Org}
                value={orgName}
            />
        );
    }

    return null;
};
