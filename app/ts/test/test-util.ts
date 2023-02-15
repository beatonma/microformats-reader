import { mf2 } from "microformats-parser";

export const parseTestHtml = (html: string) => {
    const mf = mf2(html, {
        baseUrl: "http://sally.example.com",
        experimental: { lang: true, textContent: true },
    });
    console.log(`mf: ${JSON.stringify(mf, null, 2)}`);
    return mf;
};
