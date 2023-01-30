import React, { HTMLAttributes, ReactNode } from "react";
import { useState } from "react";
import { Icon, Icons } from "./icons";
import "./dropdown.scss";

interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
    defaultIsExpanded?: boolean;
    header: ReactNode | string;
}
export const Dropdown = (props: DropdownProps) => {
    const { header, defaultIsExpanded, children } = props;
    const [isExpanded, setExpanded] = useState(defaultIsExpanded ?? false);

    const toggleState = () => setExpanded(!isExpanded);

    return (
        <div className="dropdown" data-expanded={isExpanded}>
            <div className="dropdown-header" onClick={toggleState}>
                {header}
                <Icon className="dropdown-icon" icon={Icons.ExpandMore} />
            </div>
            <div className="dropdown-content">{children}</div>
        </div>
    );
};
