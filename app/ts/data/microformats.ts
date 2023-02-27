export namespace Microformat {
    export enum H {
        Adr = "h-adr",
        Card = "h-card",
        Entry = "h-entry",
        Feed = "h-feed",
        Geo = "h-geo",
    }

    export enum P {
        Additional_Name = "p-additional-name",
        Adr = "p-adr",
        Altitude = "p-altitude",
        Author = "p-author",
        Category = "p-category",
        Country_Name = "p-country-name",
        Extended_Address = "p-extended-address",
        Family_Name = "p-family-name",
        Gender_Identity = "p-gender-identity",
        Given_Name = "p-given-name",
        Honorific_Prefix = "p-honorific-prefix",
        Honorific_Suffix = "p-honorific-suffix",
        Job_Title = "p-job-title",
        Label = "p-label",
        Latitude = "p-latitude",
        Locality = "p-locality",
        Location = "p-location",
        Longitude = "p-longitude",
        Name = "p-name",
        Nickname = "p-nickname",
        Note = "p-note",
        Org = "p-org",
        Post_Office_Box = "p-post-office-box",
        Postal_Code = "p-postal-code",
        Pronouns = "p-pronouns",
        Region = "p-region",
        Role = "p-role",
        Rsvp = "p-rsvp",
        Sex = "p-sex",
        Sort_String = "p-sort-string",
        Street_Address = "p-street-address",
        Summary = "p-summary",
        Tel = "p-tel",
    }

    export enum Dt {
        Anniversary = "dt-anniversary",
        Bday = "dt-bday",
        Published = "dt-published",
        Updated = "dt-updated",
    }

    export enum U {
        Email = "u-email",
        IMPP = "u-impp",
        InReplyTo = "u-in-reply-to",
        Key = "u-key",
        Logo = "u-logo",
        Photo = "u-photo",
        Sound = "u-sound",
        Syndication = "u-syndication",
        Uid = "u-uid",
        Url = "u-url",
        LikeOf = "u-like-of",
        RepostOf = "u-repost-of",
    }

    export enum E {
        Content = "e-content",
    }
}

export type Microformats =
    | Microformat.Dt
    | Microformat.E
    | Microformat.H
    | Microformat.P
    | Microformat.U;
