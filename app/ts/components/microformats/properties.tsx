import React, { HTMLProps, ReactNode } from "react";
import { Icon, IconProps, Icons, Svg, SvgProps } from "ts/components/icons";
import { LinkTo } from "ts/components/link-to";
import { Named } from "ts/data/h-card";
import "./properties.scss";

interface MicroformatPropertyProps extends Named {
    title?: string;
    href?: string;
    cls: string;
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
export const Property = (props: MicroformatPropertyProps) => {
    const { cls, name, icon, svg, value } = props;

    if (!value) return null;

    return (
        <span className="property" title={cls}>
            <PropertyIconOrSvg
                svg={svg}
                icon={icon}
                className="property-icon"
            />
            <PropertyName name={name} />
            <PropertyValue {...props} />
        </span>
    );
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
            <td>
                <PropertyName name={name} />
            </td>
            <td>
                <PropertyValue {...props} />
            </td>
        </tr>
    );
};

const PropertyName = (props: Named) => (
    <span className="property-name">{props.name}</span>
);

const PropertyValue = (props: MicroformatPropertyProps) => {
    const { cls, value, href, title } = props;

    const resolvedClassName = `property-value ${cls ?? ""}`;

    if (href) {
        return (
            <LinkTo href={href} className={resolvedClassName} title={title}>
                {value}
            </LinkTo>
        );
    }
    return <span className={resolvedClassName}>{value}</span>;
};

const TableHeader = (props: HTMLProps<HTMLTableElement>) => {
    if (!props.title) return null;
    return <thead>{props.title}</thead>;
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
