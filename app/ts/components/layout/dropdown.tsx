import React, { HTMLProps, ReactNode } from "react";
import { _ } from "ts/compat";
import { Icon, Icons } from "ts/components/icon";
import "ts/components/layout/dropdown.scss";
import {
    ExpandCollapseLayout,
    ExpandCollapseProps,
    ExpandableDefaultProps,
} from "ts/components/layout/expand-collapse";

export interface ExpandableProps {
    isExpanded: boolean;
    onToggleExpand?: () => void;
}

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
            <button
                className={`dropdown-header ${headerClassName ?? ""}`}
                title={
                    isExpanded ? _("dropdown_collapse") : _("dropdown_expand")
                }
                data-expanded={isExpanded}
                {...collapsibleControllerProps}
            >
                <span title={title}>{header}</span>
                <DropdownIcon isExpanded={isExpanded} />
            </button>

            <div className="dropdown-content" {...collapsibleContentProps}>
                {children}
            </div>
        </div>
    );
};

export const DropdownIcon = (
    props: HTMLProps<SVGElement> & ExpandableProps
) => {
    const { className, isExpanded, onToggleExpand, ...rest } = props;
    return (
        <Icon
            className={`dropdown-icon ${className ?? ""}`}
            data-expanded={isExpanded}
            icon={Icons.ExpandMore}
            onClick={onToggleExpand}
            title={isExpanded ? _("dropdown_collapse") : _("dropdown_expand")}
            {...rest}
        />
    );
};
