import { describe, expect, test } from "@jest/globals";
import {
    formatDate,
    formatShortDateTime,
    formatTime,
} from "ts/ui/formatting/time";

const now = new Date("2023-02-01 14:38");

describe("Date & Time Formatting", () => {
    describe("formatShortDate", () => {
        test("Today", () => {
            expect(formatShortDateTime("2023-02-01 12:01", now)).toBe(
                "12:01 today"
            );
        });

        test("Yesterday", () => {
            expect(formatShortDateTime("2023-01-31 15:02", now)).toBe(
                "15:02 yesterday"
            );
        });

        test("Any date", () => {
            expect(formatShortDateTime("2022-01-31 15:02", now)).toBe(
                "15:02 31 January 2022"
            );
        });
    });

    describe("formatDate", () => {
        test("", () => {
            expect(formatDate("2022-01-31")).toBe("31 January 2022");
        });
    });

    describe("formatTime", () => {
        test("", () => {
            expect(formatTime("2022-01-31 15:43")).toBe("15:43");
        });
    });
});
