import { MicroformatRoot, ParsedDocument } from "@microformats-parser";
import { HEventData } from "ts/data/types/h-event";
import { Microformat } from "ts/data/microformats";
import { Parse } from "ts/data/parsing/parse";
import { DateOrString } from "ts/data/types/common";
import { formatTimeDelta, isDate } from "ts/ui/formatting/time";
import { zip } from "ts/data/util/arrays";
import { parsePLocation } from "ts/data/parsing/location";
import { parseEmbeddedHCards } from "ts/data/parsing/h-card";

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
    const dateStart = Parse.getDates(event, Microformat.Dt.Start);
    const dateEnd = Parse.getDates(event, Microformat.Dt.End);
    const dateDuration =
        Parse.get<string>(event, Microformat.Dt.Duration) ??
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
        organizer: organizer,
        attendee: attendee,
    };
};

const getDuration = (
    start: DateOrString[] | null,
    end: DateOrString[] | null,
): string[] | null => {
    if (!start || !end) return null;
    if (start.length !== end.length) return null;

    const results: string[] | null =
        zip(start, end)
            ?.map(([a, b]) => {
                if (!isDate(a) || !isDate(b)) return null;

                return formatTimeDelta(a, b);
            })
            .nullIfEmpty() ?? null;

    if (results?.length !== start.length) return null;
    return results ?? null;
};
