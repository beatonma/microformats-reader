import { describe, expect, test } from "@jest/globals";
import { formatUri } from "ts/ui/formatting";

describe("Data formatting for display", () => {
    test("formatUri is correct", () => {
        expect(formatUri(null)).toBe(null);
        expect(formatUri("")).toBe(null);

        expect(formatUri("beatonma.org")).toBe("beatonma.org");
        expect(formatUri("http://beatonma.org")).toBe("beatonma.org");
        expect(formatUri("https://beatonma.org/some/path")).toBe(
            "beatonma.org/some/path"
        );
        expect(formatUri("tel:0123456789")).toBe("0123456789");
        expect(formatUri("irc://beatonma.org")).toBe("beatonma.org");
    });
});
