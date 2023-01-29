import React, { HTMLAttributes } from "react";
import "./icons.scss";

export enum Icons {
    ExpandMore = "expand_more",
}

interface IconProps extends HTMLAttributes<HTMLSpanElement> {
    icon: Icons;
}
export const Icon = (props: IconProps) => {
    const { icon, className } = props;
    return <span className={`${className} material-icons`}>{icon}</span>;
};
