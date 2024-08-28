import React from "react";
import { ParsedDocument } from "@microformats-parser";
import { HFeedData } from "ts/data/types";
import { HCardData } from "ts/data/types/h-card";
import { Dropdown } from "ts/ui/layout/dropdown";

interface MicroformatsProps {
    microformats: ParsedDocument | null;
}
export const MicroformatsRaw = (props: MicroformatsProps | null) => {
    if (!props) return null;
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

export const HFeedRaw = (props: HFeedData) => {
    return <pre>{JSON.stringify(props, null, 2)}</pre>;
};
