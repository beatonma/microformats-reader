import React from "react";
import { ParsedDocument } from "microformats-parser/dist/types";

interface MicroformatsProps {
    microformats: ParsedDocument;
}
export const MicroformatsRaw = (props: MicroformatsProps) => {
    const { microformats } = props;
    return (
        <section>
            Raw microformats:
            <pre>{`${JSON.stringify(microformats, null, 2)}`}</pre>
        </section>
    );
};
