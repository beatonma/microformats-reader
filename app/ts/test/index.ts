import { parse } from "ts/data/parsing";
import { init } from "ts/index";
import { expect } from "@jest/globals";

export const parseTestHtml = (html: string) =>
    parse(html, "https://sally.example.com");

export const assertDatesEqual = (actual: Date[] | null, expected: Date[]) => {
    expect(actual?.length).toBe(expected.length);
    if (!actual) {
        // Should be caught by length check
        throw `assertDatesEqual: \`actual\` is null (expected ${expected})`;
    }
    for (let i = 0; i < actual.length; i++) {
        expect(actual[i].toISOString()).toBe(expected[i].toISOString());
    }
};

const testInit = () => {
    init();
    Object.prototype.toString = () => JSON.stringify(this);
};

testInit();
