import { describe, expect, test } from "@jest/globals";

import { _private } from "./html";

describe("HTML parsing", () => {
    test("tailwindcss utilities are ignored", () => {
        expect(
            _private.cleanClasses(`
<div class="h-full w-full"><div class="h-card h-4 h-fit">Sally Ride</div></div>
`),
        ).toBe(`
<div class="w-full"><div class="h-card">Sally Ride</div></div>
`);
    });
});
