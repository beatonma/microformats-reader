import React, { HTMLProps, ReactNode } from "react";
import { HCardData, HCardNameDetail } from "../../data/h-card";
import { HorizontalAlignment, Row } from "../layout";
import { Image } from "microformats-parser/dist/types";
import "./hcard.scss";
import { Dropdown } from "../dropdown";
import { _ } from "../../compat/compat";
import { formatLongDate } from "../../formatting";

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
                <OptionalUrl
                    itemName={_("hcard_url")}
                    itemContent={url}
                    href={url}
                    title={url}
                />
                <OptionalField
                    itemName={_("date_of_birth")}
                    itemContent={<Birthday birthday={birthday} />}
                />
                {/*<div className="u-url">{url}</div>*/}
                {/*<div className="dt-bday">{birthday}</div>*/}
                {/*<div className="p-adr">{JSON.stringify(location)}</div>*/}
            </div>
        </Row>
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

interface NameProps {
    name?: string;
    detail?: HCardNameDetail;
}
function Name(props: NameProps) {
    const { name, detail } = props;
    return (
        <Dropdown header={name}>
            <OptionalField
                itemName={_("hcard_name_honorific_prefix")}
                itemContent={detail.honorificPrefix}
            />
            <OptionalField
                itemName={_("hcard_name_honorific_suffix")}
                itemContent={detail.honorificSuffix}
            />
            <OptionalField
                itemName={_("hcard_name_given")}
                itemContent={detail.givenName}
            />
            <OptionalField
                itemName={_("hcard_name_additional")}
                itemContent={detail.additionalName}
            />
            <OptionalField
                itemName={_("hcard_name_family")}
                itemContent={detail.familyName}
            />
            <OptionalField
                itemName={_("hcard_name_nickname")}
                itemContent={detail.nickname}
            />
            <OptionalField
                itemName={_("hcard_name_sortby")}
                itemContent={detail.sortBy}
            />
        </Dropdown>
    );
}

interface BirthdayProps {
    birthday: string;
}
function Birthday(props: BirthdayProps) {
    const { birthday } = props;
    if (!birthday) return null;

    return (
        <span className="dt-birthday">
            <time dateTime={birthday}>{formatLongDate(birthday)}</time>{" "}
            <Age birthday={birthday} />
        </span>
    );
}
function Age(props: BirthdayProps) {
    const { birthday } = props;
    const age = yearsSince(birthday);
    if (!age) return null;
    const ageMessage = _("hcard_age", age.toString());
    return <span>{`(${ageMessage})`}</span>;
}

interface OptionalFieldProps extends HTMLProps<HTMLDivElement> {
    itemName: string | ReactNode;
    itemContent: string | ReactNode | null | undefined;
}

function OptionalField(props: OptionalFieldProps) {
    const { itemName, itemContent, ...rest } = props;
    if (!itemContent) return null;

    return (
        <div {...rest}>
            <span className="">{itemName}</span>:{" "}
            <span className="">{itemContent}</span>
        </div>
    );
}

interface OptionalUrlProps extends HTMLProps<HTMLDivElement> {
    itemName: string | ReactNode;
    itemContent: string | ReactNode | null | undefined;
    href: string | null | undefined;
}
function OptionalUrl(props: OptionalUrlProps) {
    const { itemName, itemContent, href, ...rest } = props;
    if (!itemContent) return null;

    return (
        <div {...rest}>
            <span className="">{itemName}</span>:{" "}
            <a href={href} className="">
                {itemContent}
            </a>
        </div>
    );
}

/**
 * @param  {string} query A description of a place or address
 * @return {string} A formatted link for a Google Maps search
 */
const getMapsUrl = (query: string) =>
    "https://www.google.com/maps/search/" + query.replace(/[\s]+/g, "+");

// Calculate the age of someone given their birthday in yyyy-mm-dd format
function yearsSince(date: string): number | null {
    try {
        const then = new Date(date);
        const now = new Date();

        const diffMillis = now.getTime() - then.getTime();
        const years = diffMillis / (1000 * 60 * 60 * 24 * 365);
        return Math.floor(years);
    } catch (e) {
        console.error('could not parse date "' + date + '": ' + e);
        return null;
    }
}
