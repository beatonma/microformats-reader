import React, { HTMLProps } from "react";
import "./icons.scss";

export enum Icons {
    ExpandMore = "expand_more",
    PgpKey = "key",
    RssFeed = "rss_feed",
    WebmentionEndpoint = "forum",
}

interface IconProps extends HTMLProps<HTMLSpanElement> {
    icon: Icons;
}
export const Icon = (props: IconProps) => {
    const { icon, className, ...rest } = props;

    return (
        <span
            className={`${className ?? ""} material-symbols-outlined icon`}
            {...rest}
        >
            {icon}
        </span>
    );
};
