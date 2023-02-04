import React from "react";
import { ReactNode } from "react";

interface ConditionalProps {
    condition?: () => boolean;
    children?: ReactNode | ReactNode[];
}
export const ConditionalContent = (props: ConditionalProps) => {
    const condition = props.condition ?? Boolean;

    if (!condition()) {
        return null;
    }

    return <>{props.children}</>;
};
