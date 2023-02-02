import React, { HTMLProps, ReactNode, useId, useState } from "react";
import { _ } from "ts/compat";
import { Icon, Icons } from "ts/components/icons";
import "ts/components/layout/dropdown.scss";

export interface ExpandableDefaultProps {
    defaultIsExpanded?: boolean;
}

export interface ExpandableProps {
    isExpanded: boolean;
    onToggleExpand?: () => void;
}

interface DropdownProps
    extends HTMLProps<HTMLDivElement>,
        ExpandableDefaultProps {
    header: ReactNode;
    headerClassName?: string;
}
export const Dropdown = (props: DropdownProps) => {
    const {
        header,
        headerClassName,
        className,
        defaultIsExpanded,
        title,
        children,
    } = props;
    const [isExpanded, setExpanded] = useState(defaultIsExpanded ?? false);
    const contentID = useId();

    const toggleState = () => setExpanded(!isExpanded);

    return (
        <div
            className={`dropdown ${className ?? ""}`}
            data-expanded={isExpanded}
        >
            <div
                className={`dropdown-header ${headerClassName ?? ""}`}
                onClick={toggleState}
                title={
                    isExpanded ? _("dropdown_collapse") : _("dropdown_expand")
                }
                role="button"
                aria-expanded={isExpanded}
                aria-controls={contentID}
                tabIndex={0}
            >
                <span title={title}>{header}</span>
                <DropdownButton isExpanded={isExpanded} />
            </div>
            <div id={contentID} className="dropdown-content">
                {children}
            </div>
        </div>
    );
};

export const DropdownButton = (
    props: HTMLProps<HTMLSpanElement> & ExpandableProps
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
