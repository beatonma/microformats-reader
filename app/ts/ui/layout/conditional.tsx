import React from "react";
import { ReactNode } from "react";

interface ConditionalProps {
    condition: () => boolean;
    children: ReactNode | ReactNode[];
}
export const ConditionalContent = (props: ConditionalProps) => {
    if (!props.condition()) {
        return null;
    }

    return <>{props.children}</>;
};
