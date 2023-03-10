import { mf2 } from "microformats-parser";
import "ts/dev/translation";

export const parseTestHtml = (html: string) => {
    return mf2(html, {
        baseUrl: "https://sally.example.com",
        experimental: { lang: true, textContent: true },
    });
};

Object.prototype.toString = function () {
    return JSON.stringify(this);
};
