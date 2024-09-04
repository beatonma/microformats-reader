import { EmbeddedHCard } from "ts/data/types/h-card";
import React, { ReactElement, useState } from "react";
import { EmbeddedHCardDialog } from "ts/ui/microformats/h-card/h-card";
import { PropertyRow, PropertyLayoutProps } from "./properties";
import { Icons } from "ts/ui/icon";
import { _ } from "ts/compat";

interface EmbeddedHCardPropertyProps
    extends Omit<PropertyLayoutProps, "values" | "icon"> {
    embeddedHCards: EmbeddedHCard[] | null;
    icon?: Icons | null | undefined;
}

export const EmbeddedHCardProperty = (props: EmbeddedHCardPropertyProps) => {
    const [focussedHCardId, setFocussedHCardId] = useState<
        string | undefined
    >();
    const { embeddedHCards, icon = Icons.Person, ...rest } = props;
    if (!embeddedHCards) return null;

    return (
        <>
            <PropertyRow
                valuesLayout="row"
                values={embeddedHCards.map(card => {
                    const onClick = card.hcard
                        ? () => setFocussedHCardId(card.id)
                        : undefined;
                    const title = onClick
                        ? _("hcard_view_embedded_hcard")
                        : undefined;

                    return {
                        displayValue: card.name?.join(" "),
                        icon: icon ?? undefined,
                        onClick: onClick,
                        title: title,
                    };
                })}
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
