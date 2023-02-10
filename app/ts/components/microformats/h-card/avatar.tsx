import React, {HTMLProps} from "react";
import {Image} from "microformats-parser/dist/types";
import {Named} from "ts/data/common";
import {Microformats} from "ts/data/microformats";
import {HCardImages} from "ts/data/types/h-card";
import "./avatar.scss";

interface AvatarProps {
    images: HCardImages | null;
}

export const Avatar = (
    props: HTMLProps<HTMLDivElement> & Named & AvatarProps
) => {
    const { name, images, ...rest } = props;

    if (!images) {
        return <TextAvatar name={name} {...rest} />;
    }
    const { photo, logo } = images;

    if (!!photo && !!logo) return <PhotoWithLogo photo={photo} logo={logo} />;

    if (photo) {
        return (
            <SingleImageAvatar
                image={photo}
                imageClassName={Microformats.U_Photo}
            />
        );
    }

    if (logo) {
        return (
            <SingleImageAvatar
                image={logo}
                imageClassName={Microformats.U_Logo}
            />
        );
    }

    return <TextAvatar name={name} {...rest} />;
};

interface SingleImageAvatarProps {
    image: Image;
    imageClassName: string;
}
const SingleImageAvatar = (
    props: HTMLProps<HTMLDivElement> & SingleImageAvatarProps
) => {
    const { image, imageClassName, ...rest } = props;

    return (
        <div className="avatar" {...rest}>
            <img className={imageClassName} src={image.value} alt={image.alt} />
        </div>
    );
};

interface PhotoWithLogoProps {
    photo: Image;
    logo: Image;
}
const PhotoWithLogo = (
    props: HTMLProps<HTMLDivElement> & PhotoWithLogoProps
) => {
    const { name, photo, logo, ...rest } = props;
    return (
        <div className="avatar" {...rest}>
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

const TextAvatar = (props: HTMLProps<HTMLDivElement> & Named) => {
    const { name, ...rest } = props;
    const trimmedName = name?.trim();
    if (!trimmedName) return null;

    return (
        <div className="avatar" {...rest}>
            <div className="text-fallback">{trimmedName[0]}</div>
        </div>
    );
};
