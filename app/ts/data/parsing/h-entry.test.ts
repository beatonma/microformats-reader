import { describe, expect, test } from "@jest/globals";
import { parseHEntry } from "ts/data/parsing/h-entry";
import { RsvpValue, rsvpValueOf } from "ts/data/types/h-entry";
import { parseTestHtml } from "ts/test/test-util";

const SampleHtmlHEntry = `<div class="h-entry">
  <div class="p-name">Blog #1</div>
  <div class="p-summary">About a thing</div>
  <div class="e-content">Lorem ipsum</div>
  <time class="dt-published" datetime="2022-02-07"/>
  <time class="dt-updated" datetime="2023-01-06"/>
  <div class="p-author">Sally Ride</div>
  <a class="u-url" href="http://sally.example.com/posts/blah/">w</a>
  <data class="p-rsvp" value="MAYBE"/>
</div>`;

const firstHEntry = async (html: string) =>
    parseHEntry(parseTestHtml(html)?.items?.[0]?.properties);

describe("HEntry parsing", () => {
    test("entry", async () => {
        const entry = await firstHEntry(SampleHtmlHEntry);
        expect(entry?.name).toBe("Blog #1");

        expect(entry?.interactions?.rsvp).toBe(RsvpValue.Maybe);
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

    test("dates", async () => {
        const entry = await firstHEntry(SampleHtmlHEntry);
        expect(entry?.dates?.published).toBe("2022-02-07");
        expect(entry?.dates?.updated).toBe("2023-01-06");
    });
});
