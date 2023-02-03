import React from "react";
import { _ } from "ts/compat";
import {
    PropertiesTable,
    PropertyRow,
    PropertyRowLink,
} from "ts/components/microformats/properties";
import { HCardJobData } from "ts/data/h-card";
import { Microformats } from "ts/data/microformats";
import { Todo } from "ts/dev";

export const Job = (props?: HCardJobData) => {
    return <Todo message={"job preview"} />;
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
