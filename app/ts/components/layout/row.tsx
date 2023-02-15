import React, { HTMLAttributes } from "react";
import "./layout.scss";

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

export interface RowProps extends HTMLAttributes<HTMLDivElement> {
    alignment?: HorizontalAlignment;
    wrap?: boolean;
}
export const Row = (props: RowProps) => {
    const { alignment, wrap, style, className, ...rest } = props;
    const editableStyle: React.CSSProperties = style ?? {};
    if (alignment) {
        editableStyle.justifyContent = alignment;
    }
    if (wrap) {
        editableStyle.flexWrap = wrap ? "wrap" : "nowrap";
    }
    return (
        <div
            className={`row ${className ?? ""}`}
            style={editableStyle}
            {...rest}
        />
    );
};
