import React, { ComponentProps, ReactNode } from "react";
import { onlyIf } from "ts/data/util/object";
import { Alignment } from "ts/ui/layout/alignment";
import { Space } from "ts/ui/layout/space";
import { classes } from "ts/ui/util";

interface LinearLayoutProps extends ComponentProps<"div"> {
    className?: string;
    scroll?: boolean;
    wrap?: boolean;
    vertical?: Alignment;
    horizontal?: Alignment;
    space?: Space;
    horizontalSpace?: Space;
    verticalSpace?: Space;
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
        horizontalSpace = layoutName === "row" ? space : Space.None,
        verticalSpace = layoutName === "column" ? space : Space.None,
        spaceAround = false,
        stretch = false,
        ...rest
    } = props;

    const cls = classes(
        layoutName,
        className,
        onlyIf(wrap, "wrap"),
        onlyIf(scroll, "scrollable"),
        `v-${vertical}`,
        `h-${horizontal}`,
        `space-v-${verticalSpace}`,
        `space-h-${horizontalSpace}`,
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
