import React, { HTMLProps } from "react";
import { Image } from "microformats-parser/dist/types";

interface ImgProps
    extends Omit<HTMLProps<HTMLImageElement>, "src" | "alt" | "loading"> {
    image: Image | null | undefined;
}
export const Img = (props: ImgProps) => {
    if (!props.image) return null;
    const { image, ...rest } = props;
    const { value, alt } = image;

    return <img loading="lazy" src={value} alt={alt} {...rest} />;
};
