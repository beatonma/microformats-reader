import React, { ComponentProps } from "react";
import { classes } from "ts/ui/util";

/**
 * Generate a simple component that adds the given classname to its <div/>
 */
export const StyledDiv = (extraClass: string) => {
    return (props: ComponentProps<"div">) => {
        const { className, ...rest } = props;

        return <div className={classes(extraClass, className)} {...rest} />;
    };
};
