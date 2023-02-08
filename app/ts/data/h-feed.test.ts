import { describe, expect, test } from "@jest/globals";
import { parseHFeeds } from "ts/data/h-feed";
import { parseTestHtml } from "ts/test/test-util";

const SampleHtmlHEntry = `<div class="h-entry">
  <div class="p-name">Blog #1</div>
  <div class="p-summary">About a thing</div>
  <div class="e-content">Lorem ipsum</div>
  <time class="dt-published" datetime="2023-02-07"/>
  <time class="dt-updated" datetime="2023-02-07"/>
  <div class="p-author">Sally Ride</div>
  <a class="u-url" href="http://sally.example.com/posts/blah/">w</a>
</div>`;

const SampleHtmlHFeed = `<div class="h-feed">
<div class="p-name">Posts</div>
<div class="p-summary">Personal blogs</div>
<div class="p-author">Sally Ride</div>
<a class="u-url" href="http://sally.example.com/posts/">w</a>
<img class="u-photo" src="http://sally.example.com/feed.png" alt="feed image"/>
${SampleHtmlHEntry}
</div>`;

const parseTestFeeds = async (html: string) => parseHFeeds(parseTestHtml(html));
const firstHFeed = async (html: string) =>
    parseTestFeeds(html).then(data => data[0]);
const firstHEntry = async (html: string) =>
    firstHFeed(html).then(data => data.entries[0]);

describe("HFeed parsing", () => {
    test("feed metadata", async () => {
        const feed = await firstHFeed(SampleHtmlHFeed);
        const about = feed.about;

        expect(about.name).toBe("Posts");
        expect(about.summary).toBe("Personal blogs");
        expect(about.author).toBe("Sally Ride");
        expect(about.url).toBe("http://sally.example.com/posts/");
        expect(about.photo.value).toBe("http://sally.example.com/feed.png");
    });

    test("feed entries", async () => {
        const feed = await firstHFeed(SampleHtmlHFeed);
        const entries = feed.entries;
        expect(entries.length).toBe(1);

        const entry = entries[0];
        expect(entry.name).toBe("Blog #1");
    });
});

describe("HEntry parsing", () => {
    test("entry", async () => {
        const entry = await firstHEntry(SampleHtmlHEntry);
    });
});
