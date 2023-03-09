import React, { HTMLAttributes } from "react";

export enum HorizontalAlignment {
    Start = "start",
    End = "end",
    Center = "center",
    FlexStart = "flex-start",
    FlexEnd = "flex-end",
    SpaceBetween = "space-between",
    SpaceAround = "space-around",
    SpaceEvenly = "space-evenly",
}

export enum RowSpace {
    Half = "var(--space-half)",
    Normal = "var(--space-1x)",
    Char = "var(--space-char)",
}

export interface RowProps extends HTMLAttributes<HTMLDivElement> {
    alignment?: HorizontalAlignment;
    spaced?: true | RowSpace;
    wrap?: boolean;
}
export const Row = (props: RowProps) => {
    const { alignment, spaced, wrap, style, className, ...rest } = props;
    const editableStyle: React.CSSProperties = style ?? {};

    const classes = ["row", className];

    if (alignment) {
        editableStyle.justifyContent = alignment;
    }
    if (wrap) {
        editableStyle.flexWrap = "wrap";
    }
    if (spaced !== undefined) {
        if (spaced === true) editableStyle.columnGap = RowSpace.Normal;
        else {
            editableStyle.columnGap = spaced;
        }
    }

    return (
        <div
            className={classes.filter(it => !!it).join(" ")}
            style={editableStyle}
            {...rest}
        />
    );
};
