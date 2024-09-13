import { describe, expect, test } from "@jest/globals";
import { AppOptions } from "ts/options";

describe("Options", () => {
    test("MapProvider search urls are valid", () => {
        Object.values(AppOptions.MapProvider).forEach(it => {
            expect(it.search.match(/\{query}/g)?.length).toBe(1);
        });
    });
});
