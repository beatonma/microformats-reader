import React from "react";
import { ParsedDocument } from "microformats-parser/dist/types";
import { Dropdown } from "../dropdown";

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
