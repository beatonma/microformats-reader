import React, { HTMLProps, ReactNode } from "react";
import { Image } from "microformats-parser/dist/types";
import { Icon, Icons } from "ts/components/icon";
import { Img } from "ts/components/image";
import { MaybeLinkTo } from "ts/components/link-to";
import { notNullish } from "ts/data/arrays";
import { Named } from "ts/data/common";
import { Microformats } from "ts/data/microformats";
import { isString } from "ts/data/types";
import { formatUri } from "ts/formatting";
import "./properties.scss";

interface PropertyProps {
    microformat: Microformats;
    displayName?: string | null;
    title?: string;
}

interface PropertyIconProps {
    icon?: Icons;
    image?: Image | null;
}

interface PropertyValueProps extends AllowValueAsHref {
    title?: string;
    microformat: Microformats;
    href?: string | string[] | null;
    displayValue?: ReactNode | ReactNode[];
}

interface AllowValueAsHref {
    allowValueAsHref?: boolean;
}

/**
 * Display a microformat field with a name and optional icon, but only if
 * it has a non-empty value.
 * @param props
 * @constructor
 */
export const Property = (
    props: PropertyProps & PropertyValueProps & PropertyIconProps
) => {
    const {
        microformat,
        displayName,
        title,
        href,
        allowValueAsHref,
        icon,
        image,
        displayValue,
    } = props;

    if (!displayValue && !href) return null;

    return (
        <div
            className="property"
            title={microformat}
            data-microformat={microformat}
            onDoubleClick={() =>
                console.log(`Property: ${JSON.stringify(props)}`)
            }
        >
            <PropertyIcon icon={icon} image={image} />
            <PropertyName name={displayName} />
            <PropertyValue
                title={title}
                displayValue={displayValue}
                href={href}
                microformat={microformat}
                allowValueAsHref={allowValueAsHref}
            />
        </div>
    );
};

interface PropertiesTableProps {
    tableHeader?: string;
}
export const PropertiesTable = (
    props: HTMLProps<HTMLTableElement> & PropertiesTableProps
) => {
    const { className, children, ...rest } = props;
    return (
        <table className={`properties ${className ?? ""}`} {...rest}>
            <TableHeader tableHeader={props.tableHeader} />
            <tbody>{children}</tbody>
        </table>
    );
};

export const PropertyRow = (
    props: PropertyProps & PropertyValueProps & PropertyIconProps
) => {
    const {
        microformat,
        displayName,
        icon,
        image,
        displayValue,
        href,
        title,
        allowValueAsHref,
    } = props;

    if (!displayValue && !href) return null;

    return (
        <tr
            className="property"
            title={title ?? microformat}
            onDoubleClick={() =>
                console.log(`PropertyRow: ${JSON.stringify(props)}`)
            }
        >
            <td>
                <PropertyIcon icon={icon} image={image} />
            </td>

            <td>
                <PropertyName name={displayName} />
            </td>

            <td>
                <PropertyValue
                    title={title}
                    displayValue={displayValue}
                    href={href}
                    microformat={microformat}
                    allowValueAsHref={allowValueAsHref}
                />
            </td>
        </tr>
    );
};

const PropertyName = (props: Named) => {
    const { name } = props;
    if (!name) return null;
    return <div className="property-name">{name}</div>;
};

const PropertyValue = (props: PropertyValueProps) => {
    const { displayValue, href, title, microformat, allowValueAsHref } = props;

    const valueAt = (
        obj: ReactNode | ReactNode[],
        index: number
    ): ReactNode | null => {
        return (Array.isArray(obj) ? obj[index] : obj) ?? null;
    };

    if (Array.isArray(href)) {
        const values = href.map((it, index) => ({
            href: it,
            displayValue: valueAt(displayValue, index),
        }));

        return (
            <MultiValueProperty
                values={values}
                microformat={microformat}
                title={title}
                allowValueAsHref={allowValueAsHref}
            />
        );
    } else if (Array.isArray(displayValue)) {
        const values = displayValue.map((it, index) => ({
            href: valueAt(href, index) as string,
            displayValue: it,
        }));

        return (
            <MultiValueProperty
                values={values}
                microformat={microformat}
                title={title}
                allowValueAsHref={allowValueAsHref}
            />
        );
    }

    return (
        <SingleValueProperty
            href={href}
            microformat={microformat}
            title={title}
            displayValue={displayValue}
            allowValueAsHref={allowValueAsHref}
        />
    );
};

interface ZippedHrefValue {
    href: string | null | undefined;
    displayValue: ReactNode;
}
interface MultiValuePropertyProps extends AllowValueAsHref {
    microformat: Microformats;
    title: string | undefined;
    values: ZippedHrefValue[];
}
const MultiValueProperty = (props: MultiValuePropertyProps) => {
    const { microformat, title, values, allowValueAsHref } = props;

    return (
        <>
            {values.map((value, index) => (
                <SingleValueProperty
                    className="property-value-multi"
                    key={index}
                    href={value.href}
                    microformat={microformat}
                    title={title}
                    displayValue={value.displayValue}
                    allowValueAsHref={allowValueAsHref}
                />
            ))}
        </>
    );
};

interface SingleValuePropertyProps extends AllowValueAsHref {
    href: string | null | undefined;
    microformat: Microformats;
    className?: string;
    title: string | undefined;
    displayValue: ReactNode;
}
const SingleValueProperty = (props: SingleValuePropertyProps) => {
    const {
        href,
        microformat,
        className,
        displayValue,
        title,
        allowValueAsHref,
    } = props;
    const resolvedClassName = `property-value ${className ?? ""} ${
        microformat ?? ""
    }`;
    const resolvedTitle = [microformat, title].filter(notNullish).join("\n");

    let resolvedDisplayValue = displayValue;

    let resolvedHref = href;
    if (allowValueAsHref) {
        if (isString(displayValue) && displayValue.match(/^https?:\/\/\S+$/)) {
            resolvedHref = displayValue;
            resolvedDisplayValue = formatUri(displayValue);
        }
    }

    return (
        <MaybeLinkTo
            href={resolvedHref ?? undefined}
            className={resolvedClassName}
            title={resolvedTitle}
        >
            {resolvedDisplayValue ?? formatUri(resolvedHref)}
        </MaybeLinkTo>
    );
};

const TableHeader = (props: PropertiesTableProps) => {
    if (!props.tableHeader) return null;
    return <thead>{props.tableHeader}</thead>;
};

const PropertyIcon = (props: PropertyIconProps) => {
    const { image, ...rest } = props;
    if (image) {
        return <Img image={image} className="property-icon" />;
    }

    return <Icon {...rest} className="property-icon" />;
};
