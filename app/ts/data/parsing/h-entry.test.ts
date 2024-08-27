import { describe, expect, test } from "@jest/globals";
import { HEntryData, RsvpValue, rsvpValueOf } from "ts/data/types/h-entry";
import { parseTestHtml } from "ts/test/test-util";
import { DateOrString } from "ts/data/types/common";
import { HAdrData, HGeoData } from "ts/data/types";
import { EmbeddedHCard } from "ts/data/types/h-card";

const firstHEntry = async (html: string): Promise<HEntryData | null> =>
    parseTestHtml(html).then(it => it.feeds?.[0].entries?.[0] ?? null);

const expectDateToBe = (result: DateOrString | undefined, expected: Date) =>
    expect((result as Date)?.getTime()).toBe(expected.getTime());

describe("HEntry parsing", () => {
    const SampleHtmlHEntry = firstHEntry(`
<div class="h-entry">
  <div class="p-name">Blog #1</div>
  <div class="p-summary">About a thing</div>
  <div class="e-content">Lorem ipsum</div>
  <time class="dt-published" datetime="2022-02-07"/>
  <time class="dt-updated" datetime="2023-01-06"/>
  <div class="p-author">Sally Ride</div>
  <a class="u-url" href="https://sally.example.com/posts/blah/">w</a>
  <data class="p-rsvp" value="MAYBE"/>
</div>`);

    test("entry", async () => {
        const entry = await SampleHtmlHEntry;
        expect(entry?.name).toEqual(["Blog #1"]);

        expect(entry?.interactions?.rsvp).toEqual([RsvpValue.Maybe]);
    });

    test("dates", async () => {
        const entry = await SampleHtmlHEntry;
        expectDateToBe(entry?.dates?.published?.[0], new Date("2022-02-07"));
        expectDateToBe(entry?.dates?.updated?.[0], new Date("2023-01-06"));
    });

    test("rsvp value", async () => {
        expect(rsvpValueOf(undefined)).toBe(null);
        expect(rsvpValueOf(null)).toBe(null);
        expect(rsvpValueOf("")).toBe(null);
        expect(rsvpValueOf("nonsense-value")).toBe(null);

        expect(rsvpValueOf("MaYbE")).toBe(RsvpValue.Maybe);
        expect(rsvpValueOf("YES")).toBe(RsvpValue.Yes);
        expect(rsvpValueOf("Interested")).toBe(RsvpValue.Interested);
        expect(rsvpValueOf("no")).toBe(RsvpValue.No);
    });

    describe("location", () => {
        const hEntry = (content: string) =>
            firstHEntry(
                `
<div class="h-entry">
  <div class="p-name">Blog #2</div>
  ${content}
</div>`,
            );

        test("simple p-location", async () => {
            const entry = await hEntry(
                `<span class="p-location">Edinburgh</span>`,
            );
            expect((entry!.location![0] as HAdrData).value).toBe("Edinburgh");
        });

        test("embedded h-adr", async () => {
            const entry = await hEntry(
                `<div class="p-location h-adr"><span class="p-locality">Glasgow</span></div>`,
            );
            expect((entry!.location![0] as HAdrData).locality).toEqual([
                "Glasgow",
            ]);
        });
        test("embedded h-adr simple", async () => {
            const entry = await hEntry(
                `<div class="p-location h-adr">Stirling</div>`,
            );
            expect((entry!.location![0] as HAdrData).value).toBe("Stirling");
        });

        test("embedded h-geo", async () => {
            const entry = await hEntry(
                `<div class="p-location h-geo"><span class="p-latitude">57.849545107892126</span><span class="p-longitude">-3.545199942488553</span><span class="p-altitude">0</span></div>`,
            );
            const geo = entry!.location![0] as HGeoData;
            expect(geo.latitude).toBe("57.849545107892126");
            expect(geo.longitude).toBe("-3.545199942488553");
            expect(geo.altitude).toBe("0");
        });

        test("embedded h-card", async () => {
            const entry = await hEntry(
                `<div class="p-location h-card">Fancy location</div>`,
            );

            expect((entry!.location![0] as EmbeddedHCard).name).toEqual([
                "Fancy location",
            ]);
        });
    });
});
