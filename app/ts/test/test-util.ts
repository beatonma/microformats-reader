import { mf2 } from "microformats-parser";

export const parseTestHtml = (html: string) => {
    return mf2(html, {
        baseUrl: "https://sally.example.com",
        experimental: { lang: true, textContent: true },
    });
};
