import { describe, expect, test } from "@jest/globals";
import { assertDatesEqual, parseTestHtml } from "ts/test";
import { HAdrData } from "ts/data/types";

describe("HEvent parsing", () => {
    test("Sample h-event", async () => {
        const sample = `
<div class="h-event">
  <a href="https://example.org" class="u-url p-name"><h1>Microformats Meetup</h1></a>
  <p>From 
    <time class="dt-start" datetime="2013-06-30 12:00">30<sup>th</sup> June 2013, 12:00</time>
    to <time class="dt-end" datetime="2013-06-30 18:00">18:00</time>
    at <span class="p-location">Some bar in SF</span></p>
  <p class="p-summary">Get together and discuss all things microformats-related.</p>
  <span class="p-category">General meeting</span>
  <p class="p-description">Get together and discuss all things microformats-related with more detail for testing...</p>
</div>`;
        const event = await parseTestHtml(sample).then(it => it.events![0]);
        expect(event.name).toEqual(["Microformats Meetup"]);
        expect(event.url).toEqual(["https://example.org"]);
        expect(event.summary).toEqual([
            "Get together and discuss all things microformats-related.",
        ]);
        expect(event.description).toEqual([
            "Get together and discuss all things microformats-related with more detail for testing...",
        ]);
        expect((event.location as HAdrData[])[0].value).toBe("Some bar in SF");
        expect(event.category).toEqual(["General meeting"]);

        assertDatesEqual(event.dateStart as Date[], [
            new Date(2013, 5, 30, 12),
        ]);
        assertDatesEqual(event.dateEnd as Date[], [new Date(2013, 5, 30, 18)]);
        expect(event.dateDuration).toEqual(["6 hours"]);
    });
});
