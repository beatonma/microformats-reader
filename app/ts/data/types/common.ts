/**
 * Interfaces that are reused by many consumers.
 */
import { EmbeddedHCard } from "ts/data/types/h-card";
import { Microformat } from "ts/data/microformats";

export interface Named {
    name?: string | null;
}

export interface HData {
    type: Microformat.H;
}

export type DateOrString = string | Date;
export type Author = EmbeddedHCard;
