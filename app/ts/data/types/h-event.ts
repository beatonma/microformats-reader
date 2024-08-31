import { DateOrString } from "ts/data/types/common";
import { LocationData } from "ts/data/types/h-adr";
import { EmbeddedHCard } from "ts/data/types/h-card";

export interface HEventData {
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
