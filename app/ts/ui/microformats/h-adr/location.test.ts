import { describe, expect, test } from "@jest/globals";
import { _private } from "ts/ui/microformats/h-adr/location";

describe("Location UI", () => {
    test("getMapsUrl", () => {
        expect(
            _private.getMapsUrl("secret location", {
                apiName: "api",
                uiName: "ui",
                search: "https://maps.example/search?q={query}",
            }),
        ).toBe("https://maps.example/search?q=secret%20location");
    });
});
