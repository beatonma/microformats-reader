import { expect, test } from "@jest/globals";
import { isUri } from "ts/data/types/index";

test("isUri", () => {
    expect(isUri(null)).toBeFalsy();
    expect(isUri(undefined)).toBeFalsy();
    expect(isUri("")).toBeFalsy();
    expect(isUri("random text")).toBeFalsy();
    expect(isUri("irc5://bad-scheme.org")).toBeFalsy();
    expect(isUri("https://broken url.org")).toBeFalsy();
    expect(isUri("https://trailing-space.org ")).toBeFalsy();
    expect(isUri("mailto://bad@authority.org")).toBeFalsy();

    expect(isUri("https://beatonma.org")).toBeTruthy();
    expect(isUri("http://beatonma.org")).toBeTruthy();
    expect(isUri("irc://beatonma.org")).toBeTruthy();
    expect(isUri("ircs://beatonma.org")).toBeTruthy();
    expect(isUri("irc6://beatonma.org")).toBeTruthy();
    expect(isUri("tel:+1.818.555.1212")).toBeTruthy();
    expect(isUri("mailto:michael@beatonma.org")).toBeTruthy();
});
