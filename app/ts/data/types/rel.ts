export interface RelLink {
    href: string;
    text: string;
    title: string;
    type: string | null;
}

export interface RelatedLinks {
    relme: RelLink[] | null;
    pgp: RelLink[] | null;
    feeds: RelLink[] | null;
    webmention: RelLink[] | null;
}
