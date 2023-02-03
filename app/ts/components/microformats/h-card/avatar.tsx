import React from "react";
import { HCardImages, Named } from "ts/data/h-card";
import { Microformats } from "ts/data/microformats";

enum PrimaryAvatar {
    Photo = "u-photo",
    Logo = "u-logo",
}

export const Avatar = (props: HCardImages & Named) => {
    const { name, photo, logo } = props;

    if (!photo?.value && !logo?.value) {
        return <TextAvatar name={name} />;
    }

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
};

const PhotoWithLogo = (props: HCardImages) => {
    const { photo, logo } = props;
    return (
        <div className="avatar">
            <img
                loading="lazy"
                className={Microformats.U_Photo}
                title={Microformats.U_Photo}
                src={photo.value}
                alt={photo.alt}
            />
            <img
                loading="lazy"
                className={Microformats.U_Logo}
                title={Microformats.U_Logo}
                src={logo.value}
                alt={logo.alt}
            />
        </div>
    );
};

const TextAvatar = (props: Named) => {
    const { name } = props;
    const trimmedName = name?.trim();
    if (!trimmedName) return null;

    return <div className="avatar text-fallback">{trimmedName[0]}</div>;
};
