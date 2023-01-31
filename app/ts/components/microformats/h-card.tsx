import React from "react";
import { HCardData, HCardNameDetail } from "../../data/h-card";
import { HorizontalAlignment, Row } from "../layout";
import { Image } from "microformats-parser/dist/types";
import "./hcard.scss";

interface HCardProps {
    hcard: HCardData;
}
export const HCard = (props: HCardProps) => {
    const { name, nameDetail, url, photo, logo, birthday, location } =
        props.hcard;
    return (
        <Row className="h-card" alignment={HorizontalAlignment.Start}>
            <Avatar photo={photo} logo={logo} />
            <div className="hcard-detail">
                <Name name={name} detail={nameDetail} />
            </div>
            <div className="u-url">{url}</div>
            <div className="dt-bday">{birthday}</div>
            <div className="p-adr">{JSON.stringify(location)}</div>
        </Row>
        // <div className="h-card">
        //     {`${name} ${url} ${photo} ${logo} ${birthday} ${JSON.stringify(
        //         location
        //     )}`}
        // </div>
    );
};

enum PrimaryAvatar {
    Photo = "u-photo",
    Logo = "u-logo",
}
interface AvatarProps {
    photo?: Image;
    logo?: Image;
}
function Avatar(props: AvatarProps) {
    const { photo, logo } = props;

    if (!photo?.value && !logo?.value) return null;

    if (!!photo?.value && !!logo?.value) return <PhotoWithLogo {...props} />;

    const primaryImage = !!photo?.value
        ? PrimaryAvatar.Photo
        : PrimaryAvatar.Logo;
    const image = primaryImage == PrimaryAvatar.Photo ? photo : logo;

    return (
        <div className="avatar">
            <img className={primaryImage} src={image.value} alt={image.alt} />
        </div>
    );
}

function PhotoWithLogo(props: AvatarProps) {
    const { photo, logo } = props;
    return (
        <div className="avatar">
            <img className="u-photo" src={photo.value} alt={photo.alt} />
            <img className="u-logo" src={logo.value} alt={logo.alt} />
        </div>
    );
}

interface NameProps {
    name?: string;
    detail?: HCardNameDetail;
}
function Name(props: NameProps) {
    const { name, detail } = props;
    return (
        <div className="hcard-name">
            <div className="p-name">{name}</div>
            <div className="name-detail">{JSON.stringify(detail)}</div>
        </div>
    );
}
