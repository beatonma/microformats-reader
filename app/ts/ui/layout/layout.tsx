import React, { HTMLProps } from "react";
import { classes } from "ts/ui/util";

/**
 * Generate a simple component that adds the given classname to its <div/>
 */
export const StyledDiv = (extraClass: string) => {
    return (props: HTMLProps<HTMLDivElement>) => {
        const { className, ...rest } = props;

        return <div className={classes(extraClass, className)} {...rest} />;
    };
};
