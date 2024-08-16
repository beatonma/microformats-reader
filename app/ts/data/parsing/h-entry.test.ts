import { describe, expect, test } from "@jest/globals";
import { RsvpValue, rsvpValueOf } from "ts/data/types/h-entry";
import { parseTestHtml } from "ts/test/test-util";
import { DateOrString } from "ts/data/types/common";

const firstHEntry = async (html: string) =>
    parseTestHtml(html).then(it => it.feeds?.[0].entries?.[0] ?? null);

const expectDateToBe = (result: DateOrString | undefined, expected: Date) =>
    expect((result as Date)?.getTime()).toBe(expected.getTime());

describe("HEntry parsing", () => {
    const SampleHtmlHEntry = firstHEntry(`<div class="h-entry">
      <div class="p-name">Blog #1</div>
      <div class="p-summary">About a thing</div>
      <div class="e-content">Lorem ipsum</div>
      <time class="dt-published" datetime="2022-02-07"/>
      <time class="dt-updated" datetime="2023-01-06"/>
      <div class="p-author">Sally Ride</div>
      <a class="u-url" href="http://sally.example.com/posts/blah/">w</a>
      <data class="p-rsvp" value="MAYBE"/>
    </div>`);

    test("entry", async () => {
        const entry = await SampleHtmlHEntry;
        expect(entry?.name).toBe("Blog #1");

        expect(entry?.interactions?.rsvp).toBe(RsvpValue.Maybe);
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
});
