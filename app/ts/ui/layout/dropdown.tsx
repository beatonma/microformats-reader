import React, { ComponentProps, ReactNode, useContext } from "react";
import { _ } from "ts/compat";
import { OptionsContext } from "ts/options";
import { Icon, Icons } from "ts/ui/icon";
import {
    ExpandableDefaultProps,
    ExpandCollapseLayout,
    ExpandCollapseProps,
} from "ts/ui/layout/expand-collapse";
import { classes } from "ts/ui/util";
import { Row } from "ts/ui/layout/linear";
import { Alignment } from "ts/ui/layout/alignment";

export interface DropdownProps extends ComponentProps<"div"> {
    header: ReactNode;
    headerClassName?: string;
    dropdownButtonTitle: string;
}
export const Dropdown = (props: DropdownProps & ExpandableDefaultProps) => {
    const options = useContext(OptionsContext);
    const { defaultIsExpanded, ...rest } = props;

    return (
        <ExpandCollapseLayout
            defaultIsExpanded={
                defaultIsExpanded ?? options.dropdownExpandByDefault
            }
            layout={expandCollapseProps => (
                <DropdownLayout {...rest} {...expandCollapseProps} />
            )}
        />
    );
};

const DropdownLayout = (
    props: DropdownProps & ExpandCollapseProps & ComponentProps<"div">,
) => {
    const {
        className,
        headerClassName,
        header,
        title,
        dropdownButtonTitle,
        children,
        isExpanded,
        collapsibleControllerProps,
        collapsibleContentProps,
        ...rest
    } = props;

    return (
        <div
            className={classes("dropdown", className)}
            data-expanded={isExpanded}
            title={title}
            {...rest}
        >
            <DropdownButton
                dropdownButtonTitle={dropdownButtonTitle}
                className={classes("dropdown-header", headerClassName)}
                isExpanded={isExpanded}
                {...collapsibleControllerProps}
            >
                {header}
            </DropdownButton>

            <div className="dropdown-content" {...collapsibleContentProps}>
                {children}
            </div>
        </div>
    );
};

interface DropdownButtonProps {
    dropdownButtonTitle: string;
    "aria-controls": string;
    isExpanded: boolean;
    onClick: () => void;
}
export const DropdownButton = (
    props: Omit<ComponentProps<"button">, "title"> & DropdownButtonProps,
) => {
    const {
        dropdownButtonTitle,
        isExpanded,
        onClick,
        className,
        children,
        ...rest
    } = props;

    return (
        <button
            type="button"
            className={classes("dropdown-button", className)}
            onClick={onClick}
            title={
                isExpanded
                    ? _("dropdown_collapse", dropdownButtonTitle)
                    : _("dropdown_expand", dropdownButtonTitle)
            }
            aria-label={
                isExpanded
                    ? _("dropdown_collapse_label", dropdownButtonTitle)
                    : _("dropdown_expand_label", dropdownButtonTitle)
            }
            aria-expanded={isExpanded}
            data-expanded={isExpanded}
            {...rest}
        >
            <Row
                className="dropdown-button--content"
                horizontal={Alignment.Center}
            >
                {children}
                <Icon
                    className="dropdown-icon"
                    data-expanded={isExpanded}
                    icon={Icons.ExpandMore}
                />
            </Row>
        </button>
    );
};
