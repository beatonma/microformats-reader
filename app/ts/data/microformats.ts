/**
 * Overview: https://developer.mozilla.org/en-US/docs/Web/HTML/microformats
 */
export namespace Microformat {
    /** Root container classes */
    export enum H {
        Adr = "h-adr",
        Card = "h-card",
        Entry = "h-entry",
        Feed = "h-feed",
        Geo = "h-geo",
        Cite = "h-cite",
    }

    /** Plain text properties */
    export enum P {
        Additional_Name = "p-additional-name",
        Adr = "p-adr",
        Altitude = "p-altitude",
        Author = "p-author",
        Category = "p-category",
        Content = "p-content",
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
        Publication = "p-publication",
        Region = "p-region",
        Role = "p-role",
        Rsvp = "p-rsvp",
        Sex = "p-sex",
        Sort_String = "p-sort-string",
        Street_Address = "p-street-address",
        Summary = "p-summary",
        Tel = "p-tel",
    }

    /** Datetime properties */
    export enum Dt {
        Accessed = "dt-accessed",
        Anniversary = "dt-anniversary",
        Bday = "dt-bday",
        Published = "dt-published",
        Updated = "dt-updated",
    }

    /** URL properties */
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
        Video = "u-video",
    }

    /** Element tree */
    export enum E {
        Content = "e-content",
    }

    /**
     * Experimental
     */
    export namespace X {
        export type All = Pronouns;

        /**
         * https://microformats.org/wiki/pronouns-brainstorming
         */
        export enum Pronouns {
            Pronoun = "u-pronoun",
            Pronouns = "u-pronouns",
            Nominative = "p-x-pronoun-nominative", // he / she / they
            Oblique = "p-x-pronoun-oblique", // him / her / them
            Possessive = "p-x-pronoun-possessive", // his / her / their
        }
    }
}

export type Microformats =
    | Microformat.Dt
    | Microformat.E
    | Microformat.H
    | Microformat.P
    | Microformat.U
    | Microformat.X.All;
