import { describe, expect, test } from "@jest/globals";
import { Parse } from "ts/data/parsing/parse";
import { Microformat } from "ts/data/microformats";
import "ts/test";

describe("Parse", () => {
    test("get", () => {
        expect(
            Parse.get<string>({ name: ["value"] }, Microformat.P.Name),
        ).toEqual(["value"]);
    });

    test("single", () => {
        expect(
            Parse.single<string>({ name: ["value"] }, Microformat.P.Name),
        ).toBe("value");

        expect(
            Parse.single<string>(
                { name: ["multiple", "values", "are", "invalid"] },
                Microformat.P.Name,
            ),
        ).toBeNull();
    });

    test("getImages", () => {
        expect(
            Parse.getImages(
                { photo: ["https://example.org/image/"] },
                Microformat.U.Photo,
            ),
        ).toEqual([{ value: "https://example.org/image/", alt: "" }]);

        expect(
            Parse.getImages(
                {
                    photo: [
                        {
                            value: "https://example.org/image/",
                            alt: "alt text",
                        },
                    ],
                },
                Microformat.U.Photo,
            ),
        ).toEqual([{ value: "https://example.org/image/", alt: "alt text" }]);
    });

    test("getDates", () => {
        expect(
            Parse.getDates(
                { published: ["13 Jun 2020"] },
                Microformat.Dt.Published,
            )?.map(it => (it as Date).toISOString()),
        ).toEqual([new Date(2020, 5, 13).toISOString()]);

        expect(
            Parse.getDates(
                { published: ["Uninterpretable datetime"] },
                Microformat.Dt.Published,
            ),
        ).toEqual(["Uninterpretable datetime"]);
    });
    test("getEmbeddedValue", () => {
        expect(
            Parse.getEmbeddedValue(
                {
                    content: [
                        {
                            value: "content value",
                            html: "<p>content value</p>",
                        },
                    ],
                },
                Microformat.E.Content,
            ),
        ).toEqual(["content value"]);
    });

    test("getExperimental", () => {
        expect(
            Parse.getExperimental(
                {
                    pronoun: ["she", "her"],
                },
                Microformat.X.Pronouns.Pronoun,
            ),
        ).toEqual(["she", "her"]);

        expect(
            Parse.getExperimental(
                {
                    "x-pronoun": ["she", "her"],
                },
                Microformat.X.Pronouns.Pronoun,
            ),
        ).toEqual(["she", "her"]);
    });
});
