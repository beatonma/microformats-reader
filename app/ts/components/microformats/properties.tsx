import React, { HTMLProps, ReactNode } from "react";
import { Icon, Icons } from "ts/components/icon";
import { IconProps } from "ts/components/icon/icons";
import { LinkTo } from "ts/components/link-to";
import { Named } from "ts/data/common";
import "./properties.scss";

interface MicroformatPropertyProps {
    cls: string;
    value: ReactNode;
    name?: string | null;
    title?: string;
    href?: string | null;
    icon?: Icons;
}

/**
 * Display a microformat field with a name and optional icon, but only if
 * it has a non-empty value.
 * @param props
 * @constructor
 */
export const Property = (props: MicroformatPropertyProps) => {
    const { cls, name, icon, value } = props;

    if (!value) return null;

    return (
        <span className="property" title={cls}>
            <PropertyIcon icon={icon} className="property-icon" />
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
    const { cls, name, icon, value } = props;

    if (!value) return null;

    return (
        <tr className="property" {...props} title={cls}>
            <td>
                <PropertyIcon icon={icon} className="property-icon" />
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

const PropertyIcon = (props: IconProps) => {
    return <Icon {...props} />;
};
