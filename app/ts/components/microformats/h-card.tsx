import React from "react";
import { HCardData } from "../../data/h-card";

interface HCardProps {
    hcard: HCardData;
}
export const HCard = (props: HCardProps) => {
    const { name, url, photo, logo, birthday, locations } = props.hcard;
    return (
        <div className="h-card">
            {`${name} ${url} ${photo} ${logo} ${birthday} ${JSON.stringify(
                locations
            )}`}
        </div>
    );
};
