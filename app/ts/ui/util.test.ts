import { describe, expect, test } from "@jest/globals";
import { classes } from "ts/ui/util";

describe("util", () => {
    test("classes", () => {
        expect(classes("one")).toBe("one");
        expect(classes("one", "two", "three", "four")).toBe(
            "one two three four",
        );
        expect(classes("one", "", "three", "four")).toBe("one three four");
        expect(classes("one", "two", undefined, "four")).toBe("one two four");
        expect(classes(undefined, null, "")).toBe(undefined);
        expect(classes()).toBe(undefined);
    });
});
