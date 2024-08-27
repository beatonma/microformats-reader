/**
 * Interfaces that are reused by many consumers.
 */
import { EmbeddedHCard } from "ts/data/types/h-card";

export interface Named {
    name?: string | null;
}

export type DateOrString = string | Date;
export type Author = EmbeddedHCard;
