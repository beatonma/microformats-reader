import React, { HTMLProps } from "react";
import "./layout.scss";

export const InlineGroup = (props: HTMLProps<HTMLSpanElement>) => {
    const { className, ...rest } = props;
    return <span className={`${className ?? ""} group`} {...rest} />;
};
