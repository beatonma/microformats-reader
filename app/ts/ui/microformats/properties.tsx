import React, { HTMLProps, ReactNode } from "react";
import { Image } from "microformats-parser/dist/types";
import { Microformats } from "ts/data/microformats";
import { isString } from "ts/data/types";
import { Named } from "ts/data/types/common";
import { notNullish } from "ts/data/util/arrays";
import { formatUri } from "ts/ui/formatting";
import {
    formatDateTime,
    formatShortDateTime,
    isDate,
} from "ts/ui/formatting/time";
import { Icon, Icons } from "ts/ui/icon";
import { Img } from "ts/ui/image";
import { MaybeLinkTo } from "ts/ui/link-to";
import "./properties.scss";

interface PropertyProps {
    microformat: Microformats;
    displayName?: string | null;
    title?: string | null | undefined;
}

interface PropertyIconProps {
    icon?: Icons;
    image?: Image | null;
}

interface PropertyValueProps extends AllowValueAsHref {
    title?: string | null | undefined;
    microformat: Microformats;
    href?: string | string[] | null;
    displayValue?: ReactNode | ReactNode[] | Date[];
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
        obj: ReactNode | ReactNode[] | Date[],
        index: number
    ): ReactNode | Date | null => {
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
    displayValue: ReactNode | Date;
}
interface MultiValuePropertyProps extends AllowValueAsHref {
    microformat: Microformats;
    title: string | null | undefined;
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
    title: string | null | undefined;
    displayValue: ReactNode | Date;
}
const SingleValueProperty = (props: SingleValuePropertyProps) => {
    const {
        resolvedHref,
        resolvedTitle,
        resolvedDisplayValue,
        resolvedClassName,
    } = resolveValues(props);

    return (
        <MaybeLinkTo
            href={resolvedHref ?? undefined}
            className={resolvedClassName}
            title={resolvedTitle ?? undefined}
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

interface ResolvedProperties {
    resolvedClassName: string;
    resolvedHref: string | null;
    resolvedTitle: string | null;
    resolvedDisplayValue: ReactNode | null;
}
const resolveValues = (props: SingleValuePropertyProps): ResolvedProperties => {
    const {
        displayValue,
        allowValueAsHref,
        href,
        title,
        microformat,
        className,
    } = props;
    const resolvedClassName = `property-value ${className ?? ""} ${
        microformat ?? ""
    }`;

    let resolvedHref: string | null = href ?? null;
    let resolvedDisplayValue: ReactNode = isDate(displayValue)
        ? formatShortDateTime(displayValue)
        : displayValue;
    let extraTitle: (string | null)[] = [];

    if (
        allowValueAsHref &&
        isString(displayValue) &&
        displayValue.match(/^https?:\/\/\S+$/)
    ) {
        resolvedHref = displayValue;
        resolvedDisplayValue = formatUri(displayValue);
    }

    if (isDate(displayValue)) {
        extraTitle.push(formatDateTime(displayValue));
    }

    const resolvedTitle = [microformat, title, ...extraTitle]
        .filter(notNullish)
        .join("\n");

    return {
        resolvedClassName: resolvedClassName,
        resolvedDisplayValue: resolvedDisplayValue,
        resolvedHref: resolvedHref,
        resolvedTitle: resolvedTitle,
    };
};
