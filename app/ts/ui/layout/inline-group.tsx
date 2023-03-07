import React from "react";
import { Row, RowProps } from "ts/ui/layout/row";

export const InlineGroup = (props: RowProps) => {
    const { className, ...rest } = props;
    return <Row className={`${className ?? ""} group`} {...rest} />;
};
