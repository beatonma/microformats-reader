# Microformats Reader brings the Indieweb to the surface!

Install: [Chrome](https://chrome.google.com/webstore/detail/microformats-reader/phphllmalbniljekjimmalackdppmoif) | [Firefox](https://addons.mozilla.org/en-GB/firefox/addon/microformats-reader/)

This extension parses the webpages you visit to find specially tagged data such as `h-card`s, `rel` links, and webmention endpoints, then displays that content in a readable, consistent format.

Currently supported data:
- `rel` links: Webmention endpoints, RSS/Atom feeds, public keys, search, alternate.
- `h-card`
- `h-feed` and `h-entry`
- `h-event`
- `h-adr` and `h-geo`

Most standard fields for these containers are supported. However, you may find that some sites use non-standard tags, or use tags in non-standard ways. These may not be displayed at all, or you may be able to view their raw data as JSON objects. If you find cases which you think should be supported please open an issue and I will try and include them.

Tips:
- Hover over any data to view its microformat type.
- `Control + right click` any data to copy it to your clipboard.
