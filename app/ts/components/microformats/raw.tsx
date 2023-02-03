import React from "react";
import { ParsedDocument } from "microformats-parser/dist/types";
import { Dropdown } from "ts/components/layout/dropdown";
import { HCardData, HCardDates } from "ts/data/h-card";

interface MicroformatsProps {
    microformats: ParsedDocument;
}
export const MicroformatsRaw = (props: MicroformatsProps) => {
    const { microformats } = props;
    return (
        <Dropdown header="Raw microformats">
            <pre>{`${JSON.stringify(microformats, null, 2)}`}</pre>
        </Dropdown>
    );
};

export const HCardRaw = (props: HCardData) => {
    return (
        <Dropdown header="Raw h-card">
            <pre>{`${JSON.stringify(props, null, 2)}`}</pre>
        </Dropdown>
    );
};
