import React, { HTMLAttributes, ReactNode } from "react";
import { classes } from "ts/ui/util";
import { Alignment } from "ts/ui/layout/alignment";
import { Space } from "ts/ui/layout/space";
import { onlyIf } from "ts/data/util/object";

interface LinearLayoutProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    scroll?: boolean;
    wrap?: boolean;
    vertical?: Alignment;
    horizontal?: Alignment;
    space?: Space;
    spaceAround?: boolean;
    stretch?: boolean;
    children: ReactNode | ReactNode[];
}

export type LinearLayout = "row" | "column";
const LinearLayout = (
    props: LinearLayoutProps & { layoutName: LinearLayout },
) => {
    const {
        layoutName,
        className,
        wrap = false,
        scroll = false,
        children,
        vertical = layoutName === "row" ? Alignment.Center : Alignment.Start,
        horizontal = Alignment.Start,
        space = Space.Small,
        spaceAround = false,
        stretch = false,
        ...rest
    } = props;

    const cls = classes(
        layoutName,
        className,
        onlyIf(wrap, "wrapped"),
        onlyIf(scroll, "scrollable"),
        `vertical-${vertical}`,
        `horizontal-${horizontal}`,
        `space-${space}`,
        onlyIf(spaceAround, `space-around`),
        onlyIf(stretch, "fill-available"),
    );

    return (
        <div className={cls} {...rest}>
            {children}
        </div>
    );
};

export const Row = (props: LinearLayoutProps) => (
    <LinearLayout layoutName="row" {...props} />
);
export const Column = (props: LinearLayoutProps) => (
    <LinearLayout layoutName="column" {...props} />
);
export const RowOrColumn = LinearLayout;
