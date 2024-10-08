export interface RelLink {
    href: string;
    lang: string | null;
    text: string | null;
    title: string | null;
    type: string | null;
}

export interface FeedLinks {
    atom: RelLink[] | null;
    rss: RelLink[] | null;
}

export interface RelatedLinks {
    alternate: RelLink[] | null;
    pgp: RelLink[] | null;
    relme: RelLink[] | null;
    search: RelLink[] | null;
    webmention: RelLink[] | null;
    feeds: FeedLinks | null;
}
