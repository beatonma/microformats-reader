import { describe, expect, test } from "@jest/globals";
import { anyOf, noneOf, toggle } from "ts/data/util/arrays";

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

describe("toggle", () => {
    test("removes item", () => {
        expect(toggle([1, 2, 3], 1)).toEqual([2, 3]);
        expect(toggle([1, 2, 1, 3], 1)).toEqual([2, 3]);
    });

    test("appends item", () => {
        expect(toggle([2, 3], 1)).toEqual([2, 3, 1]);
        expect(toggle([], 1)).toEqual([1]);
    });
});
