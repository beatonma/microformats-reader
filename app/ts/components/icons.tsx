import React, { HTMLAttributes } from "react";
import "./icons.scss";

export enum Icons {
    ExpandMore = "expand_more",
    WebmentionEndpoint = "forum",
}

interface IconProps extends HTMLAttributes<HTMLSpanElement> {
    icon: Icons;
}
export const Icon = (props: IconProps) => {
    const { icon, className } = props;
    return (
        <span className={`${className ?? ""} material-symbols-outlined`}>
            {icon}
        </span>
    );
};
