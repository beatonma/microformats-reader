import { Image, MicroformatProperties } from "microformats-parser/dist/types";

export enum Microformats {
    H_Card = "h-card",
    P_Name = "p-name",
    P_Honorific_Prefix = "p-honorific-prefix",
    P_Given_Name = "p-given-name",
    P_Additional_Name = "p-additional-name",
    P_Family_Name = "p-family-name",
    P_Sort_String = "p-sort-string",
    P_Honorific_Suffix = "p-honorific-suffix",
    P_Nickname = "p-nickname",
    U_Email = "u-email",
    U_IMPP = "u-impp",
    U_Logo = "u-logo",
    U_Photo = "u-photo",
    U_Url = "u-url",
    U_Uid = "u-uid",
    P_Category = "p-category",
    P_Adr = "p-adr",
    P_Tel = "p-tel",
    P_Note = "p-note",
    Dt_Bday = "dt-bday",
    Dt_Anniversary = "dt-anniversary",
    U_Key = "u-key",
    P_Org = "p-org",
    P_Job_Title = "p-job-title",
    P_Role = "p-role",
    P_Sex = "p-sex",
    P_Gender_Identity = "p-gender-identity",
    P_Pronouns = "p-pronouns",
    U_Sound = "u-sound",

    // h-adr
    H_Adr = "h-adr",
    P_Post_Office_Box = "p-post-office-box",
    P_Extended_Address = "p-extended-address",
    P_Street_Address = "p-street-address",
    P_Locality = "p-locality",
    P_Region = "p-region",
    P_Postal_Code = "p-postal-code",
    P_Country_Name = "p-country-name",
    P_Label = "p-label",

    // h-geo
    H_Geo = "h-geo",
    P_Latitude = "p-latitude",
    P_Longitude = "p-longitude",
    P_Altitude = "p-altitude",

    // h-feed
    P_Author = "p-author",
}

export namespace Parse {
    export const valueOf = (obj: any, key: string): string | null => {
        const resolvedObj = getObject(obj, key);
        return coerceToString(resolvedObj);
    };

    export const coerceToString = (obj: any): string | null => {
        if (obj == null) return null;

        let value: string;
        if (typeof obj === "string") value = obj;
        else if (Array.isArray(obj)) value = coerceToString(obj[0]);
        else value = obj.toString();

        // Strip extraneous whitespace
        return value?.replace(/\s+/gm, " ");
    };

    export const getObject = (obj: any, key: string): any | null => {
        if (!obj) return null;

        if (obj.hasOwnProperty(key)) {
            return obj[key];
        }
        if (obj.hasOwnProperty("properties")) {
            return obj["properties"][key];
        }

        return null;
    };

    /**
     * Try to read 'key' or 'x-key' values for non-standardised properties.
     */
    export const parseExperimental = (
        hcard: MicroformatProperties,
        key: string
    ) => valueOf(hcard, key) ?? valueOf(hcard, `x-${key}`);

    export const parseImage = (items: Image[]): Image | null =>
        items?.find(() => true);
}
