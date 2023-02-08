import React, { HTMLProps } from "react";
import "./card.scss";

export const CardLayout = (props: HTMLProps<HTMLDivElement>) => {
    const { className, ...rest } = props;

    return <div className={`${className ?? "card"}`} {...rest} />;
};
