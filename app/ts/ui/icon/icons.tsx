import React, { HTMLProps, ReactElement } from "react";
import "ts/ui/icon/icons.scss";
// @ts-ignore
import BirthdaySvg from "ts/ui/icon/svg/outline-400/cake.svg";
// @ts-ignore
import AnniversarySvg from "ts/ui/icon/svg/outline-400/celebration.svg";
// @ts-ignore
import ExpandMoreSvg from "ts/ui/icon/svg/outline-400/expand_more.svg";
// @ts-ignore
import WebmentionEndpointSvg from "ts/ui/icon/svg/outline-400/forum.svg";
// @ts-ignore
import PgpKeySvg from "ts/ui/icon/svg/outline-400/key.svg";
// @ts-ignore
import LinkSvg from "ts/ui/icon/svg/outline-400/link.svg";
// @ts-ignore
import LocationSvg from "ts/ui/icon/svg/outline-400/location_on.svg";
// @ts-ignore
import MapSvg from "ts/ui/icon/svg/outline-400/map.svg";
// @ts-ignore
import RssFeedSvg from "ts/ui/icon/svg/outline-400/rss_feed.svg";
// @ts-ignore
import WorkSvg from "ts/ui/icon/svg/outline-400/work.svg";

export enum Icons {
    Anniversary = AnniversarySvg,
    Birthday = BirthdaySvg,
    ExpandMore = ExpandMoreSvg,
    Link = LinkSvg,
    Location = LocationSvg,
    Map = MapSvg,
    PgpKey = PgpKeySvg,
    RssFeed = RssFeedSvg,
    Work = WorkSvg,
    WebmentionEndpoint = WebmentionEndpointSvg,
}

export interface IconProps extends HTMLProps<SVGElement> {
    icon?: Icons | null;
}

export const Icon = (props: IconProps) => {
    const { icon, className, ...rest } = props;
    if (!icon) return null;

    const InlineSvg = icon as unknown as (
        _props: HTMLProps<SVGElement>
    ) => ReactElement;

    return (
        <InlineSvg
            className={`icon ${className ?? ""}`}
            role="img"
            aria-hidden={true}
            {...rest}
        />
    );
};
