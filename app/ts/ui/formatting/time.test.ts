import { describe, expect, test } from "@jest/globals";
import "ts/test/test-util";
import {
    formatDate,
    formatDateTime,
    formatShortDateTime,
    formatTime,
    yearsSince,
} from "ts/ui/formatting/time";

const now = new Date("2023-02-01 14:38");

describe("Date & Time Formatting", () => {
    describe("formatShortDate", () => {
        test("Today: show time", () => {
            expect(formatShortDateTime("2023-02-01 12:01", now)).toBe(
                "12:01 today",
            );
        });

        test("Yesterday: show time", () => {
            expect(formatShortDateTime("2023-01-31 15:02", now)).toBe(
                "15:02 yesterday",
            );
        });

        test("Any other date: no time", () => {
            expect(formatShortDateTime("2022-01-31 15:02", now)).toBe(
                "31 January 2022",
            );
        });
    });

    test("formatDate", () => {
        expect(formatDate("2022-01-31")).toBe("31 January 2022");
    });

    test("formatTime", () => {
        expect(formatTime(new Date("2022-01-31 15:43"))).toBe("15:43");
    });

    test("formatDateTime", () => {
        expect(formatDateTime("2022-01-31 15:43")).toBe(
            "15:43 31 January 2022",
        );
    });

    describe("yearsSince", () => {
        test("Date is same day of the year as now", () => {
            expect(yearsSince(now, now)).toBe(0);
            expect(yearsSince(new Date("2021-02-01"), now)).toBe(2);
            expect(yearsSince(new Date("2022-02-01"), now)).toBe(1);
        });

        test("Date is earlier in the year than now", () => {
            expect(yearsSince(new Date("2021-01-01"), now)).toBe(2);
            expect(yearsSince(new Date("2022-01-01"), now)).toBe(1);
        });

        test("Date is later in the year than now", () => {
            expect(yearsSince(new Date("2021-03-01"), now)).toBe(1);
            expect(yearsSince(new Date("2022-03-01"), now)).toBe(0);
        });
    });
});
