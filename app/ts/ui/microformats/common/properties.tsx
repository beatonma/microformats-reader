import React, {
    ComponentProps,
    MouseEvent,
    ReactElement,
    ReactNode,
    useState,
} from "react";
import { Image } from "@microformats-parser";
import { Microformat, Microformats } from "ts/data/microformats";
import { isString, isUri } from "ts/data/types";
import { DateOrString, Named } from "ts/data/types/common";
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
import { classes, titles } from "ts/ui/util";
import { Alignment, Column, Row, Space } from "ts/ui/layout";
import { nullable, withNotNull } from "ts/data/util/object";
import { EmbeddedHCardDialog } from "ts/ui/microformats/h-card/h-card";
import { EmbeddedHCard } from "ts/data/types/h-card";
import { asArray } from "ts/data/util/arrays";

enum Css {
    Property = "property",
    PropertyValue = "property-value",
    PropertyName = "property-name",
    PropertyIcon = "property-icon",
    PropertiesTable = "properties",
    PropertyValues = "property-values",
}

interface PropertyProps {
    displayName?: string | null;
    title?: string | null | undefined;
}

interface PropertyIconProps {
    image?: Image | null;
    imageMicroformat: Microformats;
}
const isPropertyIconProps = (
    value: Icons | PropertyIconProps,
): value is PropertyIconProps => {
    return typeof value === "object";
};

type DisplayValue = ReactElement | DateOrString;
type HRef = string;
type HRefOrOnClick = (() => void) | HRef;
interface PropertyValue {
    title?: string | null | undefined;
    displayValue?: DisplayValue | null | undefined;
    onClick?: HRefOrOnClick | null | undefined;
}
interface PropertyValueProps {
    title: string | null | undefined;
    values: PropertyValue[] | null;
    microformat: Microformats | undefined;
    hrefMicroformat: Microformat.U | undefined;
}

/**
 * Helper function to build PropertyValues with only `displayValue`.
 * @param values
 */
export const displayValueProperties = (
    values: DateOrString[] | null | undefined,
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
): PropertyValue[] | null => {
    const length = Math.max(displayValues?.length ?? 0, links?.length ?? 0);
    let values = [];
    for (let i = 0; i < length; i++) {
        values.push({ displayValue: displayValues?.[i], onClick: links?.[i] });
    }
    return values.nullIfEmpty();
};

interface PropertyLayoutProps {
    microformat: Microformats;
    hrefMicroformat?: Microformat.U;
    className?: string | undefined;
    property?: PropertyProps;
    values: PropertyValue | PropertyValue[] | null | undefined;
    icon?: PropertyIconProps | Icons;
}

interface PropertyLayoutBuildProps {
    layoutProps: Record<string, any>;
    propertyIcon: ReactNode;
    propertyName: ReactNode;
    propertyValue: ReactNode;
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
        />
    );

    return layoutBuilder({
        layoutProps: layoutProps,
        propertyIcon: propertyIcon,
        propertyName: propertyName,
        propertyValue: propertyValue,
        isMultiValue: isMultiValue,
    });
};

const getLayoutProps = (
    microformat: Microformats,
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
        layoutBuilder={({
            layoutProps,
            propertyIcon,
            propertyName,
            propertyValue,
            isMultiValue,
        }) => (
            <Row
                {...layoutProps}
                vertical={isMultiValue ? Alignment.Baseline : Alignment.Center}
                space={Space.Char}
            >
                <Row space={Space.Char}>
                    {propertyIcon}
                    {propertyName}
                </Row>

                {propertyValue}
            </Row>
        )}
    />
);

export const PropertyColumn = (props: PropertyLayoutProps) => (
    <PropertyLayout
        {...props}
        layoutBuilder={({
            layoutProps,
            propertyIcon,
            propertyName,
            propertyValue,
        }) => (
            <Column {...layoutProps}>
                <Row>
                    {propertyIcon}
                    {propertyName}
                </Row>
                {propertyValue}
            </Column>
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

/**
 * A <Column/> which shares the structure of <PropertyColumn /> but has
 * arbitrary content. i.e. a column with the property name and icon as a
 * header row.
 */
export const PropertyContainerColumn = (
    props: Omit<PropertyLayoutProps, "values"> & { children: ReactNode },
) => (
    <PropertyLayout
        allowNullValue={true}
        values={null}
        {...props}
        layoutBuilder={({ layoutProps, propertyIcon, propertyName }) => (
            <Column {...layoutProps}>
                <Row>
                    {propertyIcon}
                    {propertyName}
                </Row>
                {props.children}
            </Column>
        )}
    />
);

export const PropertiesTable = (props: ComponentProps<"div">) => {
    const { className, children, ...rest } = props;

    return (
        <div className={classes(className, Css.PropertiesTable)} {...rest}>
            {children}
        </div>
    );
};

interface EmbeddedHCardPropertyProps
    extends Omit<PropertyLayoutProps, "values"> {
    embeddedHCards: EmbeddedHCard[] | null;
    title?: (card: EmbeddedHCard) => string;
}
export const EmbeddedHCardProperty = (props: EmbeddedHCardPropertyProps) => {
    const [focussedHCardId, setFocussedHCardId] = useState<
        string | undefined
    >();
    const { embeddedHCards, ...rest } = props;
    if (!embeddedHCards) return null;

    return (
        <>
            <PropertyRow
                values={embeddedHCards.map((it, index) => ({
                    displayValue: it.name?.join(" "),
                    onClick: withNotNull(embeddedHCards?.[index], card =>
                        card.hcard
                            ? () => setFocussedHCardId(card.id)
                            : undefined,
                    ),
                    title: props.title?.(it),
                }))}
                {...rest}
            />
            {embeddedHCards
                ?.find(it => it.id === focussedHCardId)
                ?.let<
                    EmbeddedHCard,
                    ReactElement
                >((card: EmbeddedHCard) => <EmbeddedHCardDialog {...card} open={!!card} onClose={() => setFocussedHCardId(undefined)} />)}
        </>
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
    const { title, values, microformat, hrefMicroformat } = props;

    return (
        <div className={Css.PropertyValues}>
            {values?.map((value, index) => (
                <SinglePropertyValue
                    key={index}
                    title={titles(title, value.title)}
                    displayValue={value.displayValue}
                    microformat={microformat}
                    onClick={value.onClick}
                    hrefMicroformat={hrefMicroformat}
                />
            ))}
        </div>
    );
};

interface SingleValuePropertyProps {
    title: string | null | undefined;
    displayValue: DisplayValue | null | undefined;
    onClick: HRefOrOnClick | null | undefined;
    microformat: Microformats | undefined;
    hrefMicroformat: Microformat.U | undefined;
    className?: string;
}
const SinglePropertyValue = (props: SingleValuePropertyProps) => {
    const {
        resolvedHref,
        resolvedTitle,
        resolvedDisplayValue,
        resolvedClassName,
        resolvedOnClick,
    } = resolveValues(props);

    const onContextClick = (e: MouseEvent) => {
        if (e.ctrlKey) {
            e.preventDefault();
            copyToClipboard(resolvedHref ?? resolvedDisplayValue);
        }
    };

    if (resolvedOnClick != null) {
        return (
            <button
                className={resolvedClassName ?? undefined}
                title={resolvedTitle ?? undefined}
                onContextMenu={onContextClick}
                onClick={resolvedOnClick}
            >
                {resolvedDisplayValue}
            </button>
        );
    }

    return (
        <MaybeLinkTo
            href={resolvedHref ?? undefined}
            className={resolvedClassName ?? undefined}
            title={resolvedTitle ?? undefined}
            onContextMenu={onContextClick}
        >
            {resolvedDisplayValue}
        </MaybeLinkTo>
    );
};

interface ResolvedProperties {
    resolvedClassName: string | null;
    resolvedHref: string | null;
    resolvedTitle: string | null;
    resolvedDisplayValue: ReactNode | null;
    resolvedOnClick: (() => void) | null;
}
const resolveValues = (props: SingleValuePropertyProps): ResolvedProperties => {
    const {
        displayValue,
        onClick,
        microformat,
        hrefMicroformat,
        title,
        className,
    } = props;

    const resolvedOnClick = typeof onClick === "function" ? onClick : null;
    let resolvedHref: string | null = isString(onClick) ? onClick : null;
    let resolvedDisplayValue: ReactNode = isDate(displayValue) ? (
        <FormattedDatetime datetime={displayValue} />
    ) : (
        displayValue
    );
    const extraTitle: (string | null | undefined)[] = [microformat];

    if (isString(displayValue) && isUri(displayValue)) {
        resolvedHref = displayValue;
        resolvedDisplayValue = formatUri(displayValue);
    }

    if (resolvedHref) {
        extraTitle.push(hrefMicroformat);
    }

    if (isDate(displayValue)) {
        extraTitle.push(formatDateTime(displayValue));
    }

    return {
        resolvedClassName:
            classes(
                Css.PropertyValue,
                className,
                microformat,
                resolvedHref ? hrefMicroformat : null,
            ) ?? null,
        resolvedDisplayValue: resolvedDisplayValue,
        resolvedHref: resolvedHref,
        resolvedTitle: titles(...extraTitle, title) ?? null,
        resolvedOnClick: resolvedOnClick,
    };
};

const FormattedDatetime = (props: { datetime: Date }) => (
    <time dateTime={props.datetime.toISOString()}>
        {formatShortDateTime(props.datetime)}
    </time>
);
