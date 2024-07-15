export interface ParsedDocument {
    rels: Rels;
    "rel-urls": RelUrls;
    items: MicroformatRoot[];
}
declare type MicroformatProperty = MicroformatRoot | Image | Html | string;
declare type MicroformatProperties = Record<string, MicroformatProperty[]>;
export interface MicroformatRoot {
    id?: string;
    lang?: string;
    type?: string[];
    properties: MicroformatProperties;
    children?: MicroformatRoot[];
    value?: MicroformatProperty;
}
export interface Image {
    alt: string;
    value?: string;
}
export interface Html {
    html: string;
    value: string;
    lang?: string;
}
