import { getWebmentionEndpoint } from "./content-script";
import { expect, test } from "@jest/globals";

test("finds endpoint links", () => {
    const baseUrl = "https://beatonma.org";

    // Endpoint in <link>
    expect(
        getWebmentionEndpoint(
            '<link href="/webmention-endpoint/" rel="webmention" >',
            baseUrl
        )
    ).toBe("https://beatonma.org/webmention-endpoint/");

    // Endpoint in <link>, alternate format
    expect(
        getWebmentionEndpoint(
            '<link rel="webmention" href="/webmention-endpoint/" >',
            baseUrl
        )
    ).toBe("https://beatonma.org/webmention-endpoint/");

    // Endpoint in <a>
    expect(
        getWebmentionEndpoint(
            '<a href="/endpoint" rel="webmention" />',
            baseUrl
        )
    ).toBe("https://beatonma.org/endpoint");

    // URL without correct rel
    expect(
        getWebmentionEndpoint('<a href="/fake-endpoint">fake</a>', baseUrl)
    ).toBe(null);

    // Absolute endpoint URL
    expect(
        getWebmentionEndpoint(
            '<a href="https://beatonma.org/absolute" rel="webmention">endpoint</a>',
            baseUrl
        )
    ).toBe("https://beatonma.org/absolute");

    // Root relative URL
    expect(
        getWebmentionEndpoint(
            '<link rel="webmention" href="/webmention-endpoint/" >',
            "https://beatonma.org/subpath/"
        )
    ).toBe("https://beatonma.org/webmention-endpoint/");

    // Non-root relative URL
    expect(
        getWebmentionEndpoint(
            '<link rel="webmention" href="webmention-endpoint/" >',
            "https://beatonma.org/subpath/"
        )
    ).toBe("https://beatonma.org/subpath/webmention-endpoint/");
});
