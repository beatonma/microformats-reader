import React from "react";
import { HCardData } from "../../../data/h-card";
import { HorizontalAlignment, Row } from "../../layout";
import "./hcard.scss";
import { _ } from "../../../compat/compat";
import { Name } from "./name";
import { PropertyDiv, PropertyUriDiv } from "../properties";
import { Microformats } from "../../../data/microformats";
import { Birthday } from "./birthday";
import { Avatar } from "./primary-avatar";
import { Location } from "./location";
import { Icons } from "../../icons";

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
