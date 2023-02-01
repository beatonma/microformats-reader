import React, { ReactNode } from "react";
import { Icon, IconProps, Icons, Svg, SvgProps } from "../icons";
import "./properties.scss";
import { ExternalLink } from "../external-link";
import { Row } from "../layout";

interface MicroformatPropertyProps {
    cls: string;
    name?: string;
    icon?: Icons;
    svg?: string;
    value: ReactNode;
}

/**
 * Display a microformat field with a name and optional icon, but only if
 * it has a non-empty value.
 * @param props
 * @constructor
 */
export const PropertyDiv = (props: MicroformatPropertyProps) => {
    const { cls, name, icon, svg, value } = props;

    if (!value) return null;

    return (
        <Row className="property" title={cls}>
            <PropertyIconOrSvg
                svg={svg}
                icon={icon}
                className="property-icon"
            />
            <span className="property-name">{name}</span>
            <span className={`property-value ${cls ?? ""}`}>{value}</span>
        </Row>
    );
};

interface MicroformatUriPropertyProps extends MicroformatPropertyProps {
    href: string;
}
export const PropertyUriDiv = (props: MicroformatUriPropertyProps) => {
    const { href, value, ...rest } = props;
    let resolvedValue = (
        <ExternalLink href={href}>{value ?? href}</ExternalLink>
    );
    return <PropertyDiv value={resolvedValue} {...rest} />;
};

const PropertySvg = (props: SvgProps) => {
    return <Svg {...props} />;
};
const PropertyIcon = (props: IconProps) => {
    return <Icon {...props} />;
};
const PropertyIconOrSvg = (props: SvgProps & IconProps) => {
    const { icon, svg, className } = props;

    if (icon) return <PropertyIcon icon={icon} className={className} />;
    if (svg) return <PropertySvg svg={svg} className={className} />;
    return null;
};
