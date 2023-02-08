import React, { ComponentProps, HTMLProps, ReactNode } from "react";
import { _ } from "ts/compat";
import { Icon, Icons } from "ts/components/icon";
import "ts/components/layout/dropdown.scss";
import {
    ExpandCollapseLayout,
    ExpandCollapseProps,
    ExpandableDefaultProps,
} from "ts/components/layout/expand-collapse";

export interface DropdownProps
    extends HTMLProps<HTMLDivElement>,
        ExpandableDefaultProps {
    header: ReactNode;
    headerClassName?: string;
}
export const Dropdown = (props: DropdownProps) => {
    return (
        <ExpandCollapseLayout
            child={expandCollapseProps => (
                <DropdownLayout {...props} {...expandCollapseProps} />
            )}
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
