import React, { HTMLProps } from "react";
import "./layout.scss";

export const Caption = (props: HTMLProps<HTMLDivElement>) => {
    const { className, ...rest } = props;
    return <div className={`caption ${className ?? ""}`} {...rest} />;
};
