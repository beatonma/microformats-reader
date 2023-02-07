import React, { HTMLProps } from "react";
import "ts/components/icon/icons.scss";
// @ts-ignore
import BirthdaySvg from "ts/components/icon/svg/outline-400/cake.svg";
// @ts-ignore
import AnniversarySvg from "ts/components/icon/svg/outline-400/celebration.svg";
// @ts-ignore
import ExpandMoreSvg from "ts/components/icon/svg/outline-400/expand_more.svg";
// @ts-ignore
import WebmentionEndpointSvg from "ts/components/icon/svg/outline-400/forum.svg";
// @ts-ignore
import PgpKeySvg from "ts/components/icon/svg/outline-400/key.svg";
// @ts-ignore
import LocationSvg from "ts/components/icon/svg/outline-400/location_on.svg";
// @ts-ignore
import MapSvg from "ts/components/icon/svg/outline-400/map.svg";
// @ts-ignore
import RssFeedSvg from "ts/components/icon/svg/outline-400/rss_feed.svg";
// @ts-ignore
import WorkSvg from "ts/components/icon/svg/outline-400/work.svg";

export enum Icons {
    Anniversary = AnniversarySvg,
    Birthday = BirthdaySvg,
    ExpandMore = ExpandMoreSvg,
    Location = LocationSvg,
    Map = MapSvg,
    PgpKey = PgpKeySvg,
    RssFeed = RssFeedSvg,
    Work = WorkSvg,
    WebmentionEndpoint = WebmentionEndpointSvg,
}

export interface IconProps extends HTMLProps<SVGElement> {
    icon: Icons;
}

export const Icon = (props: IconProps) => {
    const { icon, className, ...rest } = props;
    if (icon == null) return null;
    const InlineSvg = icon;

    return (
        <InlineSvg
            className={`icon ${className ?? ""}`}
            role="img"
            aria-hidden={true}
            {...rest}
        />
    );
};
