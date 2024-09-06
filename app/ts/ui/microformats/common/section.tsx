import { AppOptions } from "ts/options";
import React, { ComponentProps, ReactElement } from "react";
import { Dropdown } from "ts/ui/layout/dropdown";
import { classes } from "ts/ui/util";

interface RequiredObjectProps<T> {
    options: AppOptions;
    sectionTitle: string;
    dependsOn: T | null;
    render: (data: T) => ReactElement;
}
export const DetailSection = <T extends any>(
    props: Omit<ComponentProps<"div">, "children"> & RequiredObjectProps<T>,
) => {
    const { options, render, sectionTitle, dependsOn, className, ...rest } =
        props;
    if (dependsOn == null) return null;

    const renderedContent = render(dependsOn);
    if (options.groupByType) {
        return (
            <Dropdown
                defaultIsExpanded={options.dropdownExpandByDefault}
                header={<span>{sectionTitle}</span>}
                dropdownButtonTitle={sectionTitle}
                className={classes("detail-section", className)}
                children={renderedContent}
                {...rest}
            />
        );
    } else {
        return <>{renderedContent}</>;
    }
};
