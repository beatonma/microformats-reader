import React from "react";
import { _ } from "ts/compat";
import { Microformat } from "ts/data/microformats";
import { HCardJobData } from "ts/data/types/h-card";
import { Icons } from "ts/ui/icon";
import { Row, Space } from "ts/ui/layout";
import { ConditionalContent } from "ts/ui/layout/conditional";
import {
    displayValueProperties,
    PropertiesTable,
    PropertyRow,
    EmbeddedHCardProperty,
} from "ts/ui/microformats/common";
import { NullablePropsOf, PropsOf } from "ts/ui/props";
import { anyOf } from "ts/data/util/arrays";

export const JobSummary = (props: NullablePropsOf<HCardJobData>) => {
    const job = props.data;
    if (!job) return null;
    const { jobTitle, role, organisation } = job;

    return (
        <Row space={Space.Char}>
            <PropertyRow
                microformat={Microformat.P.JobTitle}
                icon={Icons.Work}
                values={displayValueProperties(jobTitle)}
            />

            <ConditionalContent condition={() => jobTitle == null}>
                <PropertyRow
                    microformat={Microformat.P.Role}
                    icon={Icons.Work}
                    values={displayValueProperties(role)}
                />
            </ConditionalContent>

            <ConditionalContent
                condition={() => anyOf([jobTitle, role]) && !!organisation}
            >
                <span>@</span>
            </ConditionalContent>

            <EmbeddedHCardProperty
                icon={jobTitle ? null : Icons.Work}
                microformat={Microformat.P.Org}
                property={{ title: _("hcard_link_to_org_hcard") }}
                embeddedHCards={organisation}
            />
        </Row>
    );
};

export const JobPropertiesTable = (props: PropsOf<HCardJobData>) => {
    const { jobTitle, role, organisation } = props.data;

    return (
        <PropertiesTable>
            <PropertyRow
                microformat={Microformat.P.JobTitle}
                property={{ displayName: _("hcard_job_title") }}
                values={displayValueProperties(jobTitle)}
            />
            <PropertyRow
                microformat={Microformat.P.Role}
                property={{ displayName: _("hcard_job_role") }}
                values={displayValueProperties(role)}
            />
            <EmbeddedHCardProperty
                icon={null}
                microformat={Microformat.P.Org}
                embeddedHCards={organisation}
                property={{
                    displayName: _("hcard_job_organisation"),
                }}
            />
        </PropertiesTable>
    );
};
