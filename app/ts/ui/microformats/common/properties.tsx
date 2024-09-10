import React, { ComponentProps, ReactElement, ReactNode } from "react";
import { Image } from "@microformats-parser";
import { _ } from "ts/compat";
import { Microformat } from "ts/data/microformats";
import { isString, isUri } from "ts/data/types";
import { DateOrString, Named } from "ts/data/types/common";
import { copyToClipboardMouseEvent } from "ts/ui/actions/clipboard";
import { formatUri } from "ts/ui/formatting";
import { formatDateTime, isDate } from "ts/ui/formatting/time";
import { Icon, Icons } from "ts/ui/icon";
import { Img } from "ts/ui/image";
import { LinkTo } from "ts/ui/link-to";
import { classes, titles } from "ts/ui/util";
import { Alignment, Column, Row, Space } from "ts/ui/layout";
import { nullable } from "ts/data/util/object";
import { asArray, zipOrNull } from "ts/data/util/arrays";
import { DateTime } from "ts/ui/time";
import { LinearLayout, RowOrColumn } from "ts/ui/layout/linear";
import { IconWithText } from "ts/ui/icon/icons";

enum Css {
    Property = "property",
    PropertyValue = "property-value",
    PropertyName = "property-name",
    PropertyIcon = "property-icon",
    PropertiesTable = "properties",
    PropertyValues = "property-values",
}

export interface PropertyProps {
    displayName?: string | null;
    title?: string | null | undefined;
}

interface PropertyIconProps {
    image?: Image | null;
    imageMicroformat: Microformat;
}
const isPropertyIconProps = (
    value: Icons | PropertyIconProps,
): value is PropertyIconProps => {
    return typeof value === "object";
};

type DisplayValue = DateOrString;
type HRef = string;
type HRefOrOnClick = (() => void) | HRef;
interface PropertyValue {
    icon?: Icons | undefined;
    title?: string | null | undefined;
    displayValue?: DisplayValue | null | undefined;
    onClick?: HRefOrOnClick | null | undefined;
}
type ValueRenderer<T extends DisplayValue> = (
    value: T,
    title: string | undefined,
) => ReactElement;
interface PropertyValueProps {
    title: string | null | undefined;
    values: PropertyValue[] | null;
    microformat: Microformat | undefined;
    hrefMicroformat: Microformat.U | undefined;
    renderString?: ValueRenderer<string> | undefined;
    renderDate?: ValueRenderer<Date> | undefined;
    layout: LinearLayout;
}

/**
 * Helper function to build PropertyValues with only `displayValue`.
 * @param values
 */
export const displayValueProperties = (
    values: DisplayValue[] | null | undefined,
): PropertyValue[] | null =>
    values?.map(it => ({ displayValue: it }))?.nullIfEmpty() ?? null;

/**
 * Helper function to build PropertyValues with only `onClick`.
 */
export const onClickValueProperties = (
    values: (string | null)[] | null | undefined,
): PropertyValue[] | null =>
    values?.map(it => ({ onClick: it }))?.nullIfEmpty() ?? null;

export const linkedValueProperties = (
    displayValues: DateOrString[] | null | undefined,
    links: HRef[] | null,
): PropertyValue[] | null =>
    zipOrNull(displayValues, links)
        ?.map(([display, link]) => ({ displayValue: display, onClick: link }))
        ?.nullIfEmpty() ?? null;

export interface PropertyLayoutProps {
    microformat: Microformat;
    hrefMicroformat?: Microformat.U;
    className?: string | undefined;
    property?: PropertyProps;
    values: PropertyValue | PropertyValue[] | null | undefined;
    icon?: PropertyIconProps | Icons;
    renderString?: ValueRenderer<string>;
    renderDate?: ValueRenderer<Date>;
    valuesLayout?: LinearLayout;
}

type LayoutProps = Record<string, any>;
interface PropertyLayoutBuildProps {
    layoutProps: LayoutProps;
    propertyIcon: ReactNode;
    propertyName: ReactNode;
    propertyValue: ReactNode;
    valueLayout: LinearLayout;
    isMultiValue: boolean;
}

interface LayoutBuilder {
    layoutBuilder: (buildProps: PropertyLayoutBuildProps) => ReactNode;
    allowNullValue?: boolean;
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
        layoutBuilder,
        microformat,
        hrefMicroformat,
        className,
        property,
        values,
        icon,
        renderString,
        renderDate,
        valuesLayout = "column",
        allowNullValue = false,
    } = props;

    const resolvedValues = asArray(values)
        .map(it => nullable(it))
        .nullIfEmpty<PropertyValue>();
    if (resolvedValues == null && !allowNullValue) return null;

    const layoutProps = getLayoutProps(microformat, className, property?.title);
    const isMultiValue = (resolvedValues?.length ?? 0) > 1;

    const propertyIcon: ReactNode = <PropertyIcon icon={icon} />;
    const propertyName: ReactNode = (
        <PropertyName name={property?.displayName} />
    );
    const propertyValue: ReactNode = (
        <PropertyValue
            title={property?.title}
            values={resolvedValues}
            microformat={microformat}
            hrefMicroformat={hrefMicroformat}
            renderString={renderString}
            renderDate={renderDate}
            layout={valuesLayout}
        />
    );

    return layoutBuilder({
        layoutProps: layoutProps,
        propertyIcon: propertyIcon,
        propertyName: propertyName,
        propertyValue: propertyValue,
        isMultiValue: isMultiValue,
        valueLayout: valuesLayout,
    });
};

const getLayoutProps = (
    microformat: Microformat,
    className: string | undefined,
    title: string | null | undefined,
) => ({
    className: classes(Css.Property, className),
    title: titles(microformat, title),
    "data-microformat": microformat,
});

export const PropertyRow = (props: PropertyLayoutProps) => (
    <PropertyLayout
        {...props}
        layoutBuilder={buildProps => <PropertyRowLayout {...buildProps} />}
    />
);

export type CustomPropertyProps = Omit<PropertyLayoutProps, "values"> & {
    children: ReactNode;
};
/**
 * A <Row/> which shares the structure of <PropertyRow /> but has
 * arbitrary content. i.e. a row that starts with the property name and icon.
 */
export const CustomPropertyRow = (props: CustomPropertyProps) => (
    <PropertyLayout
        allowNullValue={true}
        values={null}
        {...props}
        layoutBuilder={({ propertyValue, ...rest }) => (
            <PropertyRowLayout {...rest} propertyValue={props.children} />
        )}
    />
);

const PropertyRowLayout = (props: PropertyLayoutBuildProps) => {
    const {
        layoutProps,
        propertyIcon,
        propertyName,
        propertyValue,
        isMultiValue,
        valueLayout,
    } = props;
    return (
        <Row
            {...layoutProps}
            space={Space.Char}
            vertical={
                valueLayout === "column" ? Alignment.Baseline : Alignment.Center
            }
        >
            <Row space={Space.Char}>
                {propertyIcon}
                {propertyName}
            </Row>

            {propertyValue}
        </Row>
    );
};

const PropertyColumnLayout = (props: PropertyLayoutBuildProps) => {
    const {
        layoutProps,
        propertyIcon,
        propertyName,
        propertyValue,
        isMultiValue,
    } = props;
    return (
        <Column {...layoutProps}>
            <Row space={Space.Char}>
                {propertyIcon}
                {propertyName}
            </Row>
            {propertyValue}
        </Column>
    );
};

export const PropertyColumn = (props: PropertyLayoutProps) => (
    <PropertyLayout
        {...props}
        layoutBuilder={buildProps => <PropertyColumnLayout {...buildProps} />}
    />
);

/**
 * A <Column/> which shares the structure of <PropertyColumn /> but has
 * arbitrary content. i.e. a column with the property name and icon as a
 * header row.
 */
export const CustomPropertyColumn = (props: CustomPropertyProps) => (
    <PropertyLayout
        allowNullValue={true}
        values={null}
        {...props}
        layoutBuilder={({ propertyValue, ...rest }) => (
            <PropertyColumnLayout {...rest} propertyValue={props.children} />
        )}
    />
);

export const PropertyImage = (
    props: Omit<
        PropertyLayoutProps,
        "values" | "property" | "hrefMicroformat"
    > & { value: Image | null },
) => {
    const { microformat, className, value } = props;
    if (!value) return null;

    const layoutProps = getLayoutProps(microformat, className, value?.alt);

    return (
        <div {...layoutProps}>
            <Img
                className={classes(Css.PropertyValue, microformat)}
                image={value}
            />
        </div>
    );
};

export const PropertiesTable = (props: ComponentProps<"div">) => {
    const { className, children, ...rest } = props;

    return (
        <div className={classes(className, Css.PropertiesTable)} {...rest}>
            {children}
        </div>
    );
};

const PropertyIcon = (props: {
    icon: PropertyIconProps | Icons | undefined;
}) => {
    const icon = props.icon;
    if (!icon) return null;

    if (isPropertyIconProps(icon)) {
        const { image, imageMicroformat } = icon;

        if (image) {
            return (
                <Img
                    image={image}
                    title={imageMicroformat}
                    className={Css.PropertyIcon}
                />
            );
        }
    } else {
        return <Icon icon={icon} className={Css.PropertyIcon} />;
    }
};

const PropertyName = (props: Named) => {
    const { name } = props;
    if (!name) return null;
    return <span className={Css.PropertyName}>{name}</span>;
};

const PropertyValue = (props: PropertyValueProps) => {
    const {
        title,
        values,
        microformat,
        hrefMicroformat,
        renderString,
        renderDate,
    } = props;

    return (
        <RowOrColumn
            className={Css.PropertyValues}
            layoutName={props.layout}
            space={Space.Medium}
        >
            {values?.map((value, index) => (
                <SinglePropertyValue
                    key={index}
                    icon={value.icon}
                    title={titles(title, value.title)}
                    displayValue={value.displayValue}
                    microformat={microformat}
                    onClick={value.onClick}
                    hrefMicroformat={hrefMicroformat}
                    renderString={renderString}
                    renderDate={renderDate}
                />
            ))}
        </RowOrColumn>
    );
};

interface SingleValuePropertyProps {
    icon: Icons | undefined;
    title: string | null | undefined;
    displayValue: DisplayValue | null | undefined;
    onClick: HRefOrOnClick | null | undefined;
    microformat: Microformat | undefined;
    hrefMicroformat: Microformat.U | undefined;
    className?: string;
    renderString: ValueRenderer<string> | undefined;
    renderDate: ValueRenderer<Date> | undefined;
}
const SinglePropertyValue = (props: SingleValuePropertyProps) => {
    const {
        resolvedHref,
        resolvedTitle,
        resolvedDisplayValue,
        resolvedClassName,
        resolvedOnClick,
    } = resolveValues(props);

    const commonProps = {
        className: resolvedClassName ?? undefined,
        title: resolvedTitle ?? undefined,
        onContextMenu: copyToClipboardMouseEvent(
            resolvedHref ?? resolvedDisplayValue,
        ),
        children: resolvedDisplayValue,
    };

    if (resolvedOnClick != null) {
        return (
            <button onClick={resolvedOnClick} {...commonProps}>
                {resolvedDisplayValue}
            </button>
        );
    }

    if (resolvedHref != null) {
        return <LinkTo href={resolvedHref} {...commonProps} />;
    }

    return <span {...commonProps} />;
};
const UnresolvedValue = (props: { value: any }) => {
    return (
        <span title={JSON.stringify(props.value)}>{_("unresolved_value")}</span>
    );
};

interface ResolvedProperties {
    resolvedClassName: string | undefined;
    resolvedHref: string | undefined;
    resolvedTitle: string | undefined;
    resolvedDisplayValue: ReactElement | string;
    resolvedOnClick: (() => void) | undefined;
}

const resolveValues = (props: SingleValuePropertyProps): ResolvedProperties => {
    const {
        icon,
        displayValue,
        onClick,
        microformat,
        hrefMicroformat,
        title,
        className,
        renderString,
        renderDate,
    } = props;
    const titleParts: (string | null | undefined)[] = [microformat];

    const buildTitle = () => titles(...titleParts, title);

    const resolvedOnClick = typeof onClick === "function" ? onClick : undefined;

    const resolvedHref = (() => {
        let href: string | undefined = undefined;
        if (isUri(onClick)) href = onClick;
        else if (isUri(displayValue)) href = displayValue;
        if (href) {
            titleParts.push(hrefMicroformat);
            titleParts.push(href);
        }
        return href;
    })();

    const resolvedDisplayValue = (() => {
        let resolved: string | ReactElement | undefined | null;

        if (displayValue == null) {
            resolved = resolvedHref?.let(it => formatUri(it, { parse: true }));
        } else if (isDate(displayValue)) {
            resolved = renderDate?.(displayValue, buildTitle()) ?? (
                <DateTime datetime={displayValue} title={buildTitle()} />
            );
            titleParts.push(formatDateTime(displayValue));
        } else if (isUri(displayValue)) {
            resolved = formatUri(displayValue, { parse: true });
        } else if (isString(displayValue)) {
            resolved = displayValue;
        }
        if (!resolved) {
            resolved = <UnresolvedValue value={displayValue} />;
        }

        if (isString(resolved)) {
            resolved = renderString?.(resolved, buildTitle()) ?? resolved;
        }

        if (icon) {
            resolved = <IconWithText icon={icon} text={resolved} />;
        }

        return resolved;
    })();

    return {
        resolvedHref: resolvedHref,
        resolvedOnClick: resolvedOnClick,
        resolvedDisplayValue: resolvedDisplayValue,
        resolvedTitle: buildTitle(),
        resolvedClassName: classes(Css.PropertyValue, microformat, className),
    };
};

export const _testOnly = {
    resolveValues: resolveValues,
};
