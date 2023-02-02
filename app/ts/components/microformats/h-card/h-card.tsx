import React from "react";
import { Birthday } from "./birthday";
import { Location } from "./location";
import { Name } from "./name";
import { Avatar } from "./primary-avatar";
import { Icons } from "ts/components/icons";
import { HorizontalAlignment, Row } from "ts/components/layout";
import {
    PropertyDiv,
    PropertyUriDiv,
} from "ts/components/microformats/properties";
import { HCardData } from "ts/data/h-card";
import { Microformats } from "ts/data/microformats";
import "./hcard.scss";

interface HCardProps {
    hcard: HCardData;
}
export const HCard = (props: HCardProps) => {
    const { name, nameDetail, url, photo, logo, birthday, location } =
        props.hcard;

    return (
        <Row
            className={Microformats.H_Card}
            alignment={HorizontalAlignment.Start}
        >
            <Avatar photo={photo} logo={logo} />
            <div className="hcard-detail">
                <Name name={name} detail={nameDetail} />
                <Location location={location} />

                <PropertyUriDiv
                    href={url}
                    cls={Microformats.U_Url}
                    icon={Icons.Url}
                    value={url}
                />
                <PropertyDiv
                    cls={Microformats.Dt_Bday}
                    icon={Icons.Birthday}
                    value={<Birthday birthday={birthday} />}
                />
            </div>
        </Row>
    );
};
