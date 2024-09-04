import React from "react";
import { HAdrData } from "ts/data/types/h-adr";
import { ExpandableCard } from "ts/ui/layout/expandable-card";
import { Microformat } from "ts/data/microformats";
import {
    LocationPropertiesTable,
    LocationSummary,
} from "ts/ui/microformats/h-adr/location";

export const HAdr = (props: {
    microformat: Microformat;
    location: HAdrData;
}) => {
    const { microformat, location } = props;

    return (
        <ExpandableCard
            className={microformat}
            title={microformat}
            contentDescription={microformat}
            sharedContent={null}
            summaryContent={
                <LocationSummary
                    microformat={microformat}
                    locations={[location]}
                />
            }
            detailContent={<LocationPropertiesTable data={location} />}
        />
    );
};
