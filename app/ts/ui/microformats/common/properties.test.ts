import { describe, expect, test } from "@jest/globals";
import { _testOnly } from "./properties";
import { Microformat } from "ts/data/microformats";
import "ts/test";

const Empty = {
    microformat: undefined,
    displayValue: undefined,
    onClick: undefined,
    hrefMicroformat: undefined,
    title: undefined,
    className: undefined,
    renderString: undefined,
    renderDate: undefined,
    icon: undefined,
};
describe("properties.resolveValues", () => {
    test("Basic text", () => {
        const resolved = _testOnly.resolveValues({
            ...Empty,
            microformat: Microformat.P.Name,
            displayValue: "Michael",
        });
        expect(resolved.resolvedDisplayValue).toBe("Michael");
        expect(resolved.resolvedTitle).toBe(Microformat.P.Name);
    });

    test("Basic href", () => {
        const resolved = _testOnly.resolveValues({
            ...Empty,
            microformat: Microformat.U.Url,
            onClick: "https://example.org",
        });
        expect(resolved.resolvedDisplayValue).toBe("example.org");
        expect(resolved.resolvedHref).toBe("https://example.org");
        expect(resolved.resolvedTitle).toBe("u-url\nhttps://example.org");
    });

    test("Text and href", () => {
        const resolved = _testOnly.resolveValues({
            ...Empty,
            displayValue: "Michael",
            microformat: Microformat.P.Name,
            hrefMicroformat: Microformat.U.Url,
            onClick: "https://example.org",
        });

        expect(resolved.resolvedDisplayValue).toBe("Michael");
        expect(resolved.resolvedHref).toBe("https://example.org");
        expect(resolved.resolvedTitle).toBe(
            "p-name\nu-url\nhttps://example.org",
        );
    });

    test("onClick function", () => {
        const resolved = _testOnly.resolveValues({
            ...Empty,
            displayValue: "Michael",
            microformat: Microformat.H.Card,
            title: "Click to open",
            onClick: () => {},
        });

        expect(resolved.resolvedDisplayValue).toBe("Michael");
        expect(resolved.resolvedTitle).toBe("h-card\nClick to open");
        expect(typeof resolved.resolvedOnClick).toBe("function");
    });
});
