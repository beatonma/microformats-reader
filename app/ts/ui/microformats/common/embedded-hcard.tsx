import { EmbeddedHCard } from "ts/data/types/h-card";
import React, { ReactElement, useState } from "react";
import { withNotNull } from "ts/data/util/object";
import { EmbeddedHCardDialog } from "ts/ui/microformats/h-card/h-card";
import { PropertyRow, PropertyLayoutProps } from "./properties";

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
                valuesLayout="row"
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
