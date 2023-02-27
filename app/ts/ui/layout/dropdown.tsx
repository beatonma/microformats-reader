import React, { ComponentProps, HTMLProps, ReactNode, useContext } from "react";
import { _ } from "ts/compat";
import { OptionsContext } from "ts/options";
import { Icon, Icons } from "ts/ui/icon";
import "ts/ui/layout/dropdown.scss";
import {
    ExpandCollapseLayout,
    ExpandCollapseProps,
    ExpandableDefaultProps,
} from "ts/ui/layout/expand-collapse";

export interface DropdownProps
    extends HTMLProps<HTMLDivElement>,
        ExpandableDefaultProps {
    header: ReactNode;
    headerClassName?: string;
    title: string;
}
export const Dropdown = (props: DropdownProps) => {
    const options = useContext(OptionsContext);
    return (
        <ExpandCollapseLayout
            defaultIsExpanded={options.dropdownExpandByDefault}
            child={expandCollapseProps => (
                <DropdownLayout {...props} {...expandCollapseProps} />
            )}
            grandChildren={props.children}
        />
    );
};

const DropdownLayout = (props: DropdownProps & ExpandCollapseProps) => {
    const {
        className,
        headerClassName,
        header,
        title,
        children,
        isExpanded,
        collapsibleControllerProps,
        collapsibleContentProps,
    } = props;

    return (
        <div
            className={`dropdown ${className ?? ""}`}
            data-expanded={isExpanded}
        >
            <DropdownButton
                title={title}
                className={`dropdown-header ${headerClassName ?? ""}`}
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
    title: string;
    "aria-controls": string;
    isExpanded: boolean;
    onClick: () => void;
}
export const DropdownButton = (
    props: ComponentProps<"button"> & DropdownButtonProps
) => {
    const { title, isExpanded, onClick, className, children, ...rest } = props;

    return (
        <button
            type={"button"}
            className={`dropdown-button ${className ?? ""}`}
            onClick={onClick}
            title={
                isExpanded
                    ? _("dropdown_collapse", title)
                    : _("dropdown_expand", title)
            }
            aria-label={
                isExpanded
                    ? _("dropdown_collapse_label", title)
                    : _("dropdown_expand_label", title)
            }
            aria-expanded={isExpanded}
            data-expanded={isExpanded}
            {...rest}
        >
            {children}
            <Icon
                className="dropdown-icon"
                data-expanded={isExpanded}
                icon={Icons.ExpandMore}
            />
        </button>
    );
};
