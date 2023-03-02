import { describe, expect, test } from "@jest/globals";
import { nullable } from "ts/data/util/object";

describe("nullable", () => {
    test("No ignored keys", () => {
        expect(nullable({})).toBeNull();
        expect(nullable({ key: null })).toBeNull();
        expect(nullable({ one: null, two: null, three: [] })).toBeNull();
        expect(nullable({ one: null, id: "some value" })).toEqual({
            one: null,
            id: "some value",
        });
    });

    test("With ignored keys", () => {
        expect(
            nullable({ one: null, ignored: "useless value" }, ["ignored"])
        ).toBeNull();

        expect(
            nullable({ one: "some values", ignored: "useless value" }, [
                "ignored",
            ])
        ).toEqual({ one: "some values", ignored: "useless value" });
    });
});
