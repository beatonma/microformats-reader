import { DateOrString, HData } from "ts/data/types/common";
import { LocationData } from "ts/data/types/h-adr";
import { EmbeddedHCard } from "ts/data/types/h-card";
import { Microformat } from "ts/data/microformats";

export interface HEventData extends HData {
    type: Microformat.H.Event;
    name: string[] | null;
    summary: string[] | null;
    description: string[] | null;
    dateStart: DateOrString[] | null;
    dateEnd: DateOrString[] | null;
    dateDuration: string[] | null;
    url: string[] | null;
    category: string[] | null;
    location: LocationData[] | null;
    organizer: EmbeddedHCard[] | null;
    attendee: EmbeddedHCard[] | null;
}
