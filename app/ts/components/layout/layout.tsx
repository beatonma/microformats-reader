import React, { HTMLProps } from "react";

/**
 * Generate a simple component that adds the given classname to its <div/>
 */
export const StyledDiv = (extraClass: string) => {
    return (props: HTMLProps<HTMLDivElement>) => {
        const { className, ...rest } = props;

        return <div className={`${extraClass} ${className ?? ""}`} {...rest} />;
    };
};
