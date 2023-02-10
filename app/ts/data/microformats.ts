export namespace Microformat {
    export enum Root {
        H_Card = "h-card",
        H_Adr = "h-adr",
        H_Geo = "h-geo",
        H_Feed = "h-feed",
        H_Entry = "h-entry",
    }

    export enum PlainProp {
        P_Name = "p-name",
        P_Honorific_Prefix = "p-honorific-prefix",
        P_Given_Name = "p-given-name",
        P_Additional_Name = "p-additional-name",
        P_Family_Name = "p-family-name",
        P_Sort_String = "p-sort-string",
        P_Honorific_Suffix = "p-honorific-suffix",
        P_Nickname = "p-nickname",
        P_Category = "p-category",
        P_Adr = "p-adr",
        P_Tel = "p-tel",
        P_Note = "p-note",
        P_Org = "p-org",
        P_Job_Title = "p-job-title",
        P_Role = "p-role",
        P_Sex = "p-sex",
        P_Gender_Identity = "p-gender-identity",
        P_Pronouns = "p-pronouns",
        P_Post_Office_Box = "p-post-office-box",
        P_Extended_Address = "p-extended-address",
        P_Street_Address = "p-street-address",
        P_Locality = "p-locality",
        P_Region = "p-region",
        P_Postal_Code = "p-postal-code",
        P_Country_Name = "p-country-name",
        P_Label = "p-label",
        P_Latitude = "p-latitude",
        P_Longitude = "p-longitude",
        P_Altitude = "p-altitude",
        P_Author = "p-author",
    }

    export enum DateProp {
        Dt_Bday = "dt-bday",
        Dt_Anniversary = "dt-anniversary",
    }

    export enum UrlProp {
        U_Email = "u-email",
        U_IMPP = "u-impp",
        U_Logo = "u-logo",
        U_Photo = "u-photo",
        U_Url = "u-url",
        U_Uid = "u-uid",
        U_Key = "u-key",
        U_Sound = "u-sound",
    }

    export enum EmbeddedProp {
        E_Content = "e-content",
    }
}
export type Microformats =
    | Microformat.DateProp
    | Microformat.EmbeddedProp
    | Microformat.Root
    | Microformat.PlainProp
    | Microformat.UrlProp;
