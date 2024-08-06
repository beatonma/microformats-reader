import React from "react";
import { CardContent, CardLayout } from "ts/ui/layout/card";
import { Alignment, Column, Space } from "ts/ui/layout";
import { Icon, Icons } from "ts/ui/icon";

export const Error = (props: { message?: string }) => (
    <CardLayout className="error">
        <CardContent>
            <Column horizontal={Alignment.Center} space={Space.Medium}>
                <Icon icon={Icons.Error} />
                {props.message ?? ""}
            </Column>
        </CardContent>
    </CardLayout>
);
