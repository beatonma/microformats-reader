import { describe, expect, test } from "@jest/globals";
import {
    parseLocation,
    parseLocationFromProperties,
} from "ts/data/parsing/location";
import "ts/test";
import { Microformat } from "ts/data/microformats";
import { dump } from "ts/dev";
import { HGeoData } from "ts/data/types";

describe("Location parsing", () => {
    test("parseLocation", () => {
        const loc = parseLocation({
            type: ["h-adr"],
            properties: {
                locality: ["Inverness"],
                region: ["Scotland"],
                "country-name": ["UK"],
                geo: [
                    {
                        type: ["h-geo"],
                        properties: {
                            latitude: ["57.4767"],
                            longitude: ["-4.2274"],
                            altitude: ["3m"],
                        },
                    },
                ],
            },
            value: "Inverness | Scotland | UK",
        })!;

        dump(loc);

        expect(loc.locality).toEqual(["Inverness"]);
        expect(loc.region).toEqual(["Scotland"]);
        expect(loc.countryName).toEqual(["UK"]);

        const geo = loc.geo![0] as HGeoData;
        expect(geo.latitude).toBe("57.4767");
        expect(geo.longitude).toBe("-4.2274");
        expect(geo.altitude).toBe("3m");
    });

    test("parseLocationFromProperties", () => {
        expect(
            parseLocationFromProperties(
                {
                    adr: [
                        {
                            type: ["h-adr"],
                            properties: {
                                "street-address": ["17 Austerstræti"],
                                locality: ["Reykjavík"],
                                "country-name": ["Iceland"],
                                "postal-code": ["107"],
                                name: ["17 Austerstræti Reykjavík Iceland 107"],
                            },
                        },
                    ],
                },
                [Microformat.H.Adr],
            ),
        ).toEqual([
            {
                streetAddress: ["17 Austerstræti"],
                locality: ["Reykjavík"],
                countryName: ["Iceland"],
                postalCode: ["107"],
                value: "17 Austerstræti Reykjavík Iceland 107",
                region: null,
                extendedAddress: null,
                postOfficeBox: null,
                label: null,
                geo: null,
            },
        ]);
    });
});
