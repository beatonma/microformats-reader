import React, { HTMLProps, ReactNode } from "react";
import { ExternalLink } from "ts/components/external-link";
import { Icon, IconProps, Icons, Svg, SvgProps } from "ts/components/icons";
import { Row } from "ts/components/layout";
import "./properties.scss";

interface MicroformatPropertyProps {
    cls: string;
    name?: string;
    icon?: Icons;
    svg?: string;
    value: ReactNode;
}
interface MicroformatUriPropertyProps extends MicroformatPropertyProps {
    href: string;
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

/**
 * Display a microformat field with a name and optional icon, but only if
 * it has a non-empty value.
 * @param props
 * @constructor
 */
export const PropertySpan = (props: MicroformatPropertyProps) => {
    const { cls, name, icon, svg, value } = props;

    if (!value) return null;

    return (
        <span className="property" title={cls}>
            <PropertyIconOrSvg
                svg={svg}
                icon={icon}
                className="property-icon"
            />
            <span className="property-name">{name}</span>
            <span className={`property-value ${cls ?? ""}`}>{value}</span>
        </span>
    );
};

export const PropertyLinkDiv = (props: MicroformatUriPropertyProps) => {
    const { cls, href, value, ...rest } = props;
    let resolvedValue = (
        <ExternalLink href={href} title={cls}>
            {value ?? href}
        </ExternalLink>
    );
    return <PropertyDiv value={resolvedValue} cls={cls} {...rest} />;
};

export const PropertyLinkSpan = (props: MicroformatUriPropertyProps) => {
    const { cls, href, value, ...rest } = props;
    let resolvedValue = (
        <ExternalLink href={href} title={cls}>
            {value ?? href}
        </ExternalLink>
    );
    return <PropertySpan value={resolvedValue} cls={cls} {...rest} />;
};

export const PropertiesTable = (props: HTMLProps<HTMLTableElement>) => {
    const { className, children, ...rest } = props;
    return (
        <table className={`properties ${className ?? ""}`} {...rest}>
            <TableHeader title={props.title} />
            <tbody>{children}</tbody>
        </table>
    );
};

const TableHeader = (props: HTMLProps<HTMLTableElement>) => {
    if (!props.title) return null;
    return <thead>{props.title}</thead>;
};

export const PropertyRow = (props: MicroformatPropertyProps) => {
    const { cls, name, icon, svg, value } = props;

    if (!value) return null;

    return (
        <tr className="property" {...props} title={cls}>
            <td>
                <PropertyIconOrSvg
                    svg={svg}
                    icon={icon}
                    className="property-icon"
                />
            </td>
            <td className="property-name">{name}</td>
            <td className={`property-value ${cls ?? ""}`}>{value}</td>
        </tr>
    );
};

export const PropertyRowLink = (props: MicroformatUriPropertyProps) => {
    const { value, cls, href, ...rest } = props;

    if (!value) return null;
    return (
        <PropertyRow
            cls={cls}
            value={
                <ExternalLink href={href} title={cls}>
                    {value}
                </ExternalLink>
            }
            {...rest}
        />
    );
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
