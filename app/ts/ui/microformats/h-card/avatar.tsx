import React, { HTMLProps, useState } from "react";
import { Image } from "microformats-parser/dist/types";
import { Microformat } from "ts/data/microformats";
import { Named } from "ts/data/types/common";
import { HCardImages } from "ts/data/types/h-card";
import { Img } from "ts/ui/image";
import "./avatar.scss";

interface AvatarProps {
    images: HCardImages | null;
}

export const Avatar = (
    props: HTMLProps<HTMLDivElement> & Named & AvatarProps
) => {
    const { name, images, ...rest } = props;
    const [hasLoadingError, setLoadingError] = useState(false);

    if (hasLoadingError || !images) {
        return <TextAvatar name={name} {...rest} />;
    }
    const { photo, logo } = images;
    const onError = () => setLoadingError(true);

    if (!!photo && !!logo)
        return <PhotoWithLogo photo={photo} logo={logo} onError={onError} />;

    if (photo) {
        return (
            <SingleImageAvatar
                image={photo}
                imageClassName={Microformat.U.Photo}
                onError={onError}
            />
        );
    }

    if (logo) {
        return (
            <SingleImageAvatar
                image={logo}
                imageClassName={Microformat.U.Logo}
                onError={onError}
            />
        );
    }

    return <TextAvatar name={name} {...rest} />;
};

interface SingleImageAvatarProps {
    image: Image;
    imageClassName: string;
    onError: () => void;
}
const SingleImageAvatar = (
    props: HTMLProps<HTMLDivElement> & SingleImageAvatarProps
) => {
    const { image, imageClassName, onError, ...rest } = props;

    return (
        <div className="avatar" {...rest}>
            <Img image={image} className={imageClassName} onError={onError} />
        </div>
    );
};

interface PhotoWithLogoProps {
    photo: Image;
    logo: Image;
    onError: () => void;
}
const PhotoWithLogo = (
    props: HTMLProps<HTMLDivElement> & PhotoWithLogoProps
) => {
    const { name, photo, logo, onError, ...rest } = props;
    return (
        <div className="avatar" {...rest}>
            <Img
                image={photo}
                className={Microformat.U.Photo}
                title={Microformat.U.Photo}
                onError={onError}
            />
            <Img
                image={logo}
                className={Microformat.U.Logo}
                title={Microformat.U.Logo}
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