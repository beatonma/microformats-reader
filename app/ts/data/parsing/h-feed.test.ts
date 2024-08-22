import { describe, expect, test } from "@jest/globals";
import { parseTestHtml } from "ts/test/test-util";

const SampleHtmlHFeed = `<div class="h-feed">
    <div class="p-name">Posts</div>
    <div class="p-summary">Personal blogs</div>
    <div class="p-author">Sally Ride</div>
    <a class="u-url" href="https://sally.example.com/posts/">w</a>
    <img class="u-photo" src="https://sally.example.com/feed.png" alt="feed image"/>
    
    <div class="h-entry">
      <div class="p-name">Blog #1</div>
      <div class="p-summary">About a thing</div>
      <div class="e-content">Lorem ipsum</div>
      <time class="dt-published" datetime="2022-02-07"/>
      <time class="dt-updated" datetime="2023-01-06"/>
      <div class="p-author">Sally Ride</div>
      <a class="u-url" href="https://sally.example.com/posts/blah/">w</a>
      <data class="p-rsvp" value="MAYBE"/>
    </div>
</div>`;

const parseTestFeeds = async (html: string) =>
    parseTestHtml(html).then(it => it.feeds);
const firstHFeed = async (html: string) =>
    parseTestFeeds(html).then(data => data?.[0] ?? null);

describe("HFeed parsing", () => {
    test("feed metadata", async () => {
        const feed = await firstHFeed(SampleHtmlHFeed);
        const about = feed!.about!;

        expect(about!.name).toEqual(["Posts"]);
        expect(about!.summary).toEqual(["Personal blogs"]);
        expect(about!.author?.[0]?.name).toEqual(["Sally Ride"]);
        expect(about!.url).toEqual(["https://sally.example.com/posts/"]);
        expect(about!.photo![0].value).toBe(
            "https://sally.example.com/feed.png",
        );
    });

    test("feed entries", async () => {
        const feed = await firstHFeed(SampleHtmlHFeed);
        const entries = feed?.entries;
        expect(entries?.length).toBe(1);

        const entry = entries?.[0];
        expect(entry?.name).toEqual(["Blog #1"]);
    });
});
