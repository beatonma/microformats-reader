import React from "react";
import { ReactNode } from "react";

interface ConditionalProps {
    condition: (() => boolean) | boolean;
    children: ReactNode | ReactNode[];
}
export const ConditionalContent = (props: ConditionalProps) => {
    const { condition, children } = props;

    if (
        condition === false ||
        (typeof condition === "function" && !condition())
    ) {
        return null;
    }

    return <>{children}</>;
};
