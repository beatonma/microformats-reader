import { describe, expect, test } from "@jest/globals";
import { _testOnly, nullable } from "ts/data/util/object";

describe("nullable", () => {
    test("No ignored keys, no required keys", () => {
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
            nullable(
                { one: null, ignored: "useless value" },
                { ignoredKeys: ["ignored"] },
            ),
        ).toBeNull();

        expect(
            nullable(
                { one: "some values", ignored: "useless value" },
                {
                    ignoredKeys: ["ignored"],
                },
            ),
        ).toEqual({ one: "some values", ignored: "useless value" });
    });

    test("With required keys", () => {
        const data = { one: null, two: "required" };
        expect(nullable(data, { requiredKeys: ["one"] })).toBeNull();
        expect(nullable(data, { requiredKeys: ["one", "two"] })).toBeNull();
        expect(nullable(data, { requiredKeys: ["two"] })).toEqual(data);

        // @ts-ignore TS2322: Type "missing" is not assignable to type "one" | "two"
        expect(nullable(data, { requiredKeys: ["missing"] })).toBeNull();
    });

    test("With required and ignored keys", () => {
        const data = {
            one: null,
            required: "required-value",
            ignored: "ignored-value",
        };
        expect(
            nullable(data, {
                ignoredKeys: ["ignored"],
                requiredKeys: ["required"],
            }),
        ).toEqual(data);
        expect(
            nullable(data, {
                ignoredKeys: ["ignored"],
                requiredKeys: ["one", "required"],
            }),
        ).toBeNull();
        expect(
            nullable(data, {
                ignoredKeys: ["one"],
                requiredKeys: ["required"],
            }),
        ).toEqual(data);
        expect(
            nullable(data, { ignoredKeys: ["ignored"], requiredKeys: ["one"] }),
        ).toBeNull();
    });

    test("With requireOneKey", () => {
        const data = {
            one: null,
            two: "blah",
            three: "blahhh",
            four: null,
        };
        expect(nullable(data, { requireAnyKey: ["two", "three"] })).toEqual(
            data,
        );
        expect(nullable(data, { requireAnyKey: ["one", "two"] })).toEqual(data);
        expect(nullable(data, { requireAnyKey: ["one", "four"] })).toBeNull();
    });
});

test("hasRequiredKeys", () => {
    const data = {
        name: "John",
        age: 42,
        hobbies: ["reading", "swimming"],
        friends: [],
        job: null,
        pet: {
            name: "Fluffy",
            type: "cat",
            age: 3,
            favoriteFood: ["tuna"],
            isCute: true,
        },
        address: undefined,
    };

    expect(
        _testOnly.hasRequiredKeys(data, ["age", "hobbies", "pet"], undefined),
    ).toBeTruthy();
    expect(_testOnly.hasRequiredKeys(data, ["friends"], undefined)).toBeFalsy();
    expect(
        _testOnly.hasRequiredKeys(data, ["name", "job"], undefined),
    ).toBeFalsy();
    expect(
        _testOnly.hasRequiredKeys(data, undefined, ["name", "job"]),
    ).toBeTruthy();

    expect(_testOnly.hasRequiredKeys(data, undefined, undefined)).toBeTruthy();
});
