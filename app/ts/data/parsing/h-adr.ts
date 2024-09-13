import { MicroformatRoot, ParsedDocument } from "@microformats-parser";
import { HAdrData } from "ts/data/types";
import { Parse } from "ts/data/parsing/parse";
import { Microformat } from "ts/data/microformats";
import { parseLocation } from "ts/data/parsing/location";

export const parseHAdrs = async (
    microformats: ParsedDocument,
): Promise<HAdrData[] | null> =>
    Parse.getRootsOfType(microformats.items, Microformat.H.Adr)
        .map(parseHAdr)
        .nullIfEmpty();

export const parseHGeos = async (
    microformats: ParsedDocument,
): Promise<HAdrData[] | null> =>
    Parse.getRootsOfType(microformats.items, Microformat.H.Geo)
        .map(parseHAdr)
        .nullIfEmpty();

const parseHAdr = (root: MicroformatRoot): HAdrData | null =>
    parseLocation(root);
