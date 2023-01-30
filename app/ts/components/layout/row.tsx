import React from "react";
import { HTMLProps } from "react";
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
    const { alignment, style, ...rest } = props;
    const editableStyle: React.CSSProperties = style ?? {};
    if (alignment) {
        editableStyle.justifyContent = alignment;
    }
    return <div className={`row`} style={editableStyle} {...rest} />;
};
