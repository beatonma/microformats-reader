import { MicroformatRoot, ParsedDocument } from "@microformats-parser";
import { HEventData } from "ts/data/types/h-event";
import { Microformat } from "ts/data/microformats";
import { Parse } from "ts/data/parsing/parse";
import { DateOrString } from "ts/data/types/common";
import { formatTimeDelta, isDate } from "ts/ui/formatting/time";
import { parsePLocation } from "ts/data/parsing/location";
import { parseEmbeddedHCards } from "ts/data/parsing/h-card";
import { nullable } from "ts/data/util/object";

export const parseHEvents = async (
    microformats: ParsedDocument,
): Promise<HEventData[] | null> => {
    return Parse.getRootsOfType(microformats.items, Microformat.H.Event)
        .map(parseHEvent)
        .nullIfEmpty();
};

const parseHEvent = (root: MicroformatRoot): HEventData | null => {
    const event = root.properties;
    const name = Parse.get<string>(event, Microformat.P.Name);
    const summary = Parse.get<string>(event, Microformat.P.Summary);
    const description =
        Parse.get<string>(event, Microformat.P.Description) ??
        Parse.getEmbeddedValue(event, Microformat.E.Content);
    const url = Parse.get<string>(event, Microformat.U.Url);
    const category = Parse.get<string>(event, Microformat.P.Category);
    const dateStart = Parse.getDates(event, Microformat.Dt.Start)?.[0] ?? null;
    const dateEnd = Parse.getDates(event, Microformat.Dt.End)?.[0] ?? null;
    const dateDuration =
        Parse.single<string>(event, Microformat.Dt.Duration) ??
        getDuration(dateStart, dateEnd);

    const location = parsePLocation(root);
    const organizer = parseEmbeddedHCards(event, Microformat.X.Event.Organizer);
    const attendee = parseEmbeddedHCards(event, Microformat.X.Event.Attendee);

    return {
        type: Microformat.H.Event,
        name: name,
        url: url,
        summary: summary,
        description: description,
        category: category,
        dateEnd: dateEnd,
        dateStart: dateStart,
        dateDuration: dateDuration,
        location: location,
        people: nullable({
            organizer: organizer,
            attendee: attendee,
        }),
    };
};

const getDuration = (
    start: DateOrString | null,
    end: DateOrString | null,
): string | null => {
    if (!start || !end) return null;
    if (!isDate(start) || !isDate(end)) return null;
    return formatTimeDelta(start, end);
};
