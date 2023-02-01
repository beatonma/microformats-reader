import React, { HTMLProps, ReactNode } from "react";
import { useState } from "react";
import { Icon, Icons } from "./icons";
import "./dropdown.scss";
import { _ } from "../compat/compat";

interface DropdownProps extends HTMLProps<HTMLDivElement> {
    defaultIsExpanded?: boolean;
    header: ReactNode;
    headerClassName?: string;
}
export const Dropdown = (props: DropdownProps) => {
    const { header, headerClassName, className, defaultIsExpanded, children } =
        props;
    const [isExpanded, setExpanded] = useState(defaultIsExpanded ?? false);

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
            >
                {header}
                <Icon className="dropdown-icon" icon={Icons.ExpandMore} />
            </div>
            <div className="dropdown-content">{children}</div>
        </div>
    );
};
