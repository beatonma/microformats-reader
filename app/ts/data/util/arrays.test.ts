import { describe, expect, test } from "@jest/globals";
import { allOf, anyOf, noneOf, partition, zip } from "ts/data/util/arrays";
import "ts/test";

describe("Array functions", () => {
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

    describe("allOf", () => {
        expect(allOf([])).toBeFalsy();
        expect(allOf([null, undefined, []])).toBeFalsy();
        expect(allOf([1, 2, 3])).toBeTruthy();
        expect(allOf([1, null, 3])).toBeFalsy();
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

    test("partition", () => {
        expect(partition([1, 2, 3, 4, 5, 6], it => it % 2 === 0)).toEqual([
            [2, 4, 6],
            [1, 3, 5],
        ]);
    });
});
