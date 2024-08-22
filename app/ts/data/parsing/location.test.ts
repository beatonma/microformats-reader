import { describe, expect, test } from "@jest/globals";
import { parseLocation } from "ts/data/parsing/location";
import "ts/test/test-util";

describe("Location parsing", () => {
    test("simple h-card", () => {
        const loc = parseLocation({
            type: ["h-adr"],
            properties: {
                locality: ["Inverness"],
                region: ["Scotland"],
                "country-name": ["UK"],
            },
            value: "Inverness | Scotland | UK",
        })!;

        expect(loc.locality).toEqual(["Inverness"]);
        expect(loc.region).toEqual(["Scotland"]);
        expect(loc.countryName).toEqual(["UK"]);
    });
});
