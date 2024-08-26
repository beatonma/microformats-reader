import React, { ComponentProps, ReactNode } from "react";
import { classes } from "ts/ui/util";

interface TooltipProps extends Omit<ComponentProps<"div">, "title"> {
    tooltip: ReactNode;
}
export const Tooltip = (props: TooltipProps) => {
    const { tooltip, className, children, ...rest } = props;

    if (React.Children.count(tooltip) === 0) return <>{children}</>;

    return (
        <div className={classes("tooltip-root", className)} {...rest}>
            {children}
            <div className="tooltip-wrapper">
                <div className="tooltip">{tooltip}</div>
            </div>
        </div>
    );
};
