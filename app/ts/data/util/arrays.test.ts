import { describe, expect, test } from "@jest/globals";
import { anyOf, noneOf, zip } from "ts/data/util/arrays";

describe("noneOf", () => {
    test("All empty values", () => {
        expect(noneOf([])).toBeTruthy();
        expect(noneOf([null])).toBeTruthy();
        expect(noneOf([null, [], [], undefined])).toBeTruthy();
        expect(noneOf([[], null])).toBeTruthy();
    });

    test("Non-empty values", () => {
        expect(noneOf([1])).toBeFalsy();
    });
});

describe("anyOf", () => {
    test("All empty values", () => {
        expect(anyOf([])).toBeFalsy();
        expect(anyOf([null])).toBeFalsy();
        expect(anyOf([[], null, undefined])).toBeFalsy();
    });

    test("Non-empty values", () => {
        expect(
            anyOf([null, null, undefined, null, null, null, 0]),
        ).toBeTruthy();
        expect(
            anyOf([null, null, null, null, undefined, null, [0]]),
        ).toBeTruthy();
    });
});

describe("zip", () => {
    test("Valid lists", () => {
        expect(zip(["a", "b", "c"], [1, 2, 3])).toEqual([
            ["a", 1],
            ["b", 2],
            ["c", 3],
        ]);
    });

    test("Different cardinality lists returns null", () => {
        expect(zip(["a", "b", "c"], [1, 2])).toBeNull();
    });
});
