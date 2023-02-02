import React from "react";
import { Row, RowProps } from "ts/components/layout/row";
import "./layout.scss";

export const InlineGroup = (props: RowProps) => {
    const { className, ...rest } = props;
    return <Row className={`${className ?? ""} group`} {...rest} />;
};
