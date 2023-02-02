import React from "react";
import { Image } from "microformats-parser/dist/types";

enum PrimaryAvatar {
    Photo = "u-photo",
    Logo = "u-logo",
}

interface AvatarProps {
    photo?: Image;
    logo?: Image;
}

export function Avatar(props: AvatarProps) {
    const { photo, logo } = props;

    if (!photo?.value && !logo?.value) return null;

    if (!!photo?.value && !!logo?.value) return <PhotoWithLogo {...props} />;

    const primaryImage = !!photo?.value
        ? PrimaryAvatar.Photo
        : PrimaryAvatar.Logo;
    const image = primaryImage == PrimaryAvatar.Photo ? photo : logo;

    return (
        <div className="hcard-avatar">
            <img className={primaryImage} src={image.value} alt={image.alt} />
        </div>
    );
}

function PhotoWithLogo(props: AvatarProps) {
    const { photo, logo } = props;
    return (
        <div className="hcard-avatar">
            <img className="u-photo" src={photo.value} alt={photo.alt} />
            <img className="u-logo" src={logo.value} alt={logo.alt} />
        </div>
    );
}
