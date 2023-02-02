import React, { HTMLAttributes, HTMLProps } from "react";
import { _ } from "ts/compat";
import "./icons.scss";

export enum Icons {
    Birthday = "cake",
    ExpandMore = "expand_more",
    Location = "location_on",
    Map = "map",
    PgpKey = "key",
    RssFeed = "rss_feed",
    Url = "link",
    WebmentionEndpoint = "forum",
}

export interface IconProps extends HTMLProps<HTMLSpanElement> {
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

export interface SvgProps extends HTMLAttributes<SVGElement> {
    svg: string;
}
export const Svg = (props: SvgProps) => {
    const { svg, className, ...rest } = props;
    let resolvedSvgData: string = svg;
    if (svg.startsWith("svg__")) {
        resolvedSvgData = _(svg);
    }
    return (
        <svg
            dangerouslySetInnerHTML={{ __html: resolvedSvgData }}
            className={`icon ${className ?? ""}`}
            {...rest}
        />
    );
};
