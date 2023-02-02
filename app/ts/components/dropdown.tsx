import React, { HTMLProps, ReactNode, useId, useState } from "react";
import { Icon, Icons } from "./icons";
import { _ } from "ts/compat";
import "./dropdown.scss";

export interface ExpandableProps {
    defaultIsExpanded?: boolean;
}

interface DropdownProps extends HTMLProps<HTMLDivElement>, ExpandableProps {
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
                <Icon className="dropdown-icon" icon={Icons.ExpandMore} />
            </div>
            <div id={contentID} className="dropdown-content">
                {children}
            </div>
        </div>
    );
};
