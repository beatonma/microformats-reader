import React, { HTMLProps, MouseEvent, ReactNode } from "react";
import { Image } from "@microformats-parser";
import { Microformats } from "ts/data/microformats";
import { isString, isUri } from "ts/data/types";
import { Named } from "ts/data/types/common";
import { notNullish } from "ts/data/util/arrays";
import { copyToClipboard } from "ts/ui/actions/clipboard";
import { formatUri } from "ts/ui/formatting";
import {
    formatDateTime,
    formatShortDateTime,
    isDate,
} from "ts/ui/formatting/time";
import { Icon, Icons } from "ts/ui/icon";
import { Img } from "ts/ui/image";
import { MaybeLinkTo } from "ts/ui/link-to";
import { classes } from "ts/ui/util";

type DisplayValue = ReactNode | string[] | Date[];

interface PropertyProps {
    microformat: Microformats;
    displayName?: string | null;
    title?: string | null | undefined;
}

interface PropertyIconProps {
    icon?: Icons;
    image?: Image | null;
    imageMicroformat?: Microformats;
}

interface PropertyValueProps {
    title?: string | null | undefined;
    microformat: Microformats;
    href?: string | string[] | null;
    displayValue?: DisplayValue;
    links?: Link[] | null;
}

interface Link {
    href: string | null | undefined;
    displayValue: ReactNode | Date | null | undefined;
}
const isLink = (obj: any | undefined): obj is Link =>
    obj?.hasOwnProperty("href") && obj?.hasOwnProperty("displayValue");

interface PropertyLayoutBuildProps {
    layoutProps: Record<string, any>;
    propertyIcon: ReactNode;
    propertyName: ReactNode;
    propertyValue: ReactNode;
}

type PropertyLayoutProps = PropertyProps &
    PropertyValueProps &
    PropertyIconProps;

interface LayoutBuilder {
    layoutBuilder: (buildProps: PropertyLayoutBuildProps) => ReactNode;
}

/**
 * Display a microformat field with a name and optional icon, but only if
 * it has a non-empty value.
 *
 * Display values are accepted in the following formats:
 * - A single [href] AND/OR a single [displayValue].
 * - An array of [href] OR an array of [displayValue].
 *   - !!! If either of these is provided as an array, providing a value for the other will throw an exception.
 * - An array of [links].
 *
 */
const PropertyLayout = (props: PropertyLayoutProps & LayoutBuilder) => {
    const {
        microformat,
        displayName,
        title,
        href,
        icon,
        image,
        imageMicroformat,
        displayValue,
        links,
        layoutBuilder,
    } = props;

    if (!displayValue && !href && !links) return null;

    checkPropertyLayoutConfiguration(props);

    const layoutProps = {
        className: "property",
        title: title ?? microformat,
        "data-microformat": microformat,
    };
    const propertyIcon: ReactNode = (
        <PropertyIcon
            icon={icon}
            image={image}
            imageMicroformat={imageMicroformat}
        />
    );
    const propertyName: ReactNode = <PropertyName name={displayName} />;
    const propertyValue: ReactNode = (
        <PropertyValue
            title={title}
            displayValue={displayValue}
            href={href}
            microformat={microformat}
        />
    );

    const layout = layoutBuilder({
        layoutProps: layoutProps,
        propertyIcon: propertyIcon,
        propertyName: propertyName,
        propertyValue: propertyValue,
    });

    return <>{layout}</>;
};

/**
 * Throw an exception if the given props contains an invalid combination of values.
 */
const checkPropertyLayoutConfiguration = (props: PropertyLayoutProps) => {
    const { links, href, displayValue } = props;

    if (
        !!displayValue &&
        !!href &&
        (Array.isArray(displayValue) || Array.isArray(href))
    ) {
        throw (
            "Property error: " +
            "Both [href, displayValue] are defined and contain multiple values. " +
            "This should be replaced with the 'links' property."
        );
    }

    if (!!links && (!!displayValue || !!href)) {
        throw (
            "Property error: " +
            "[links] should be used instead of [href, displayValue], " +
            "not in combination with them."
        );
    }
};

export const Property = (props: PropertyLayoutProps) => (
    <PropertyLayout
        {...props}
        layoutBuilder={buildProps => (
            <div {...buildProps.layoutProps}>
                {buildProps.propertyIcon}
                {buildProps.propertyName}
                {buildProps.propertyValue}
            </div>
        )}
    />
);

interface PropertiesTableProps {
    tableHeader?: string;
}
export const PropertiesTable = (
    props: HTMLProps<HTMLTableElement> & PropertiesTableProps,
) => {
    const { className, children, ...rest } = props;
    return (
        <table className={classes("properties", className)} {...rest}>
            <TableHeader tableHeader={props.tableHeader} />
            <tbody>{children}</tbody>
        </table>
    );
};

export const PropertyRow = (props: PropertyLayoutProps) => (
    <PropertyLayout
        {...props}
        layoutBuilder={buildProps => (
            <tr {...buildProps.layoutProps}>
                <td>{buildProps.propertyIcon}</td>
                <td>{buildProps.propertyName}</td>
                <td>{buildProps.propertyValue}</td>
            </tr>
        )}
    />
);

const PropertyIcon = (props: PropertyIconProps) => {
    const { image, imageMicroformat, ...rest } = props;
    if (image) {
        return (
            <Img
                image={image}
                title={imageMicroformat}
                className="property-icon"
            />
        );
    }

    return <Icon {...rest} className="property-icon" />;
};

const PropertyName = (props: Named) => {
    const { name } = props;
    if (!name) return null;
    return <div className="property-name">{name}</div>;
};

const PropertyValue = (props: PropertyValueProps) => {
    const { displayValue, href, links, title, microformat } = props;

    if (!Array.isArray(href) && !Array.isArray(displayValue)) {
        return (
            <SingleValueProperty
                href={href}
                microformat={microformat}
                title={title}
                displayValue={displayValue}
            />
        );
    }

    if (href != null && !Array.isArray(href))
        throw "Unexpected state: property href is not an array.";
    if (displayValue != null && !Array.isArray(displayValue))
        throw "Unexpected state: property displayValue is not an array.";

    return (
        <MultiValueProperty
            microformat={microformat}
            title={title}
            links={links}
            values={href ?? displayValue}
        />
    );
};

interface MultiValuePropertyProps {
    microformat: Microformats;
    title: string | null | undefined;
    links: Link[] | null | undefined;
    values: string[] | Date[] | null | undefined;
}
const MultiValueProperty = (props: MultiValuePropertyProps) => {
    const { microformat, title, links, values } = props;

    const properties =
        (values ?? links)?.map((value, index) => {
            const valueIsLink = isLink(value);

            return (
                <SingleValueProperty
                    className="property-value-multi"
                    key={index}
                    href={valueIsLink ? value.href : null}
                    microformat={microformat}
                    title={title}
                    displayValue={valueIsLink ? value.displayValue : value}
                />
            );
        }) ?? null;

    return <>{properties}</>;
};

interface SingleValuePropertyProps {
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

    const onContextClick = (e: MouseEvent) => {
        if (e.ctrlKey) {
            e.preventDefault();
            copyToClipboard(props.href ?? props.displayValue);
        }
    };

    return (
        <MaybeLinkTo
            href={resolvedHref ?? undefined}
            className={resolvedClassName}
            title={resolvedTitle ?? undefined}
            onContextMenu={onContextClick}
        >
            {resolvedDisplayValue ?? formatUri(resolvedHref)}
        </MaybeLinkTo>
    );
};

const TableHeader = (props: PropertiesTableProps) => {
    if (!props.tableHeader) return null;
    return <thead>{props.tableHeader}</thead>;
};

interface ResolvedProperties {
    resolvedClassName: string;
    resolvedHref: string | null;
    resolvedTitle: string | null;
    resolvedDisplayValue: ReactNode | null;
}
const resolveValues = (props: SingleValuePropertyProps): ResolvedProperties => {
    const { displayValue, href, title, microformat, className } = props;

    let resolvedHref: string | null = href ?? null;
    let resolvedDisplayValue: ReactNode = isDate(displayValue)
        ? formatShortDateTime(displayValue)
        : displayValue;
    const extraTitle: (string | null)[] = [];

    if (isString(displayValue) && isUri(displayValue)) {
        resolvedHref = displayValue;
        resolvedDisplayValue = formatUri(displayValue);
    }

    if (isDate(displayValue)) {
        extraTitle.push(formatDateTime(displayValue));
    }

    const resolvedTitle = [microformat, ...extraTitle, title]
        .filter(notNullish)
        .join("\n");

    return {
        resolvedClassName: classes("property-value", className, microformat),
        resolvedDisplayValue: resolvedDisplayValue,
        resolvedHref: resolvedHref,
        resolvedTitle: resolvedTitle,
    };
};
