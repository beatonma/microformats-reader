import { getWebmentionEndpoint } from "./content-script";
import { describe, expect, test } from "@jest/globals";

// describe("", () => {
test("finds endpoint links", () => {
    expect(
        getWebmentionEndpoint(
            '<link href="/webmention-endpoint/" rel="webmention" >'
        )
    ).toBe("/webmention-endpoint/");

    expect(
        getWebmentionEndpoint(
            '<link rel="webmention" href="/webmention-endpoint/" >'
        )
    ).toBe("/webmention-endpoint/");

    expect(
        getWebmentionEndpoint('<a href="/endpoint" rel="webmention" />')
    ).toBe("/endpoint");

    expect(getWebmentionEndpoint('<a href="/fake-endpoint">fake</a>')).toBe(
        null
    );
});
// });
