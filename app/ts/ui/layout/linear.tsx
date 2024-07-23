import React, { HTMLAttributes, ReactNode } from "react";
import { classes } from "ts/ui/util";
import { onlyIf } from "ts/data/util";
import { Alignment } from "ts/ui/layout/alignment";
import { Space } from "ts/ui/layout/space";

interface LinearLayoutProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    scroll?: boolean;
    wrap?: boolean;
    vertical?: Alignment;
    horizontal?: Alignment;
    space?: Space;
    spaceAround?: boolean;
    children: ReactNode | ReactNode[];
}
export const Row = (props: LinearLayoutProps) => (
    <LinearLayout layoutName="row" {...props} />
);
export const Column = (props: LinearLayoutProps) => (
    <LinearLayout layoutName="column" {...props} />
);

const LinearLayout = (
    props: LinearLayoutProps & { layoutName: "row" | "column" },
) => {
    const {
        layoutName,
        className,
        wrap = false,
        scroll = false,
        children,
        vertical = Alignment.Center,
        horizontal = Alignment.Start,
        space = Space.Small,
        spaceAround = false,
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
    );

    return (
        <div className={cls} {...rest}>
            {children}
        </div>
    );
};
