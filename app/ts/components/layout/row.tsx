import React, { HTMLProps } from "react";
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
interface RowProps extends HTMLProps<HTMLDivElement> {
    alignment?: HorizontalAlignment;
}
export const Row = (props: RowProps) => {
    const { alignment, style, className, ...rest } = props;
    const editableStyle: React.CSSProperties = style ?? {};
    if (alignment) {
        editableStyle.justifyContent = alignment;
    }
    return (
        <div
            className={`row ${className ?? ""}`}
            style={editableStyle}
            {...rest}
        />
    );
};
