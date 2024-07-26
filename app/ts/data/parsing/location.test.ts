import { describe, expect, test } from "@jest/globals";
import { parseLocation } from "ts/data/parsing/location";

const HCard = {
    name: ["Michael Beaton"],
    addr: [
        {
            type: ["h-adr"],
            properties: {
                locality: ["Inverness"],
                region: ["Scotland"],
                "country-name": ["UK"],
            },
            value: "Inverness | Scotland | UK",
        },
    ],
    url: [],
    logo: [],
    bday: [],
};

describe("Location parsing", () => {
    test("", () => {
        const loc = parseLocation(HCard)!;

        expect(loc.locality).toEqual(["Inverness"]);
        expect(loc.region).toEqual(["Scotland"]);
        expect(loc.countryName).toEqual(["UK"]);
    });
});
