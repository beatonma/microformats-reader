import { mf2 } from "microformats-parser";

export const parseTestHtml = (html: string) =>
    mf2(html, { baseUrl: "http://sally.example.com" });
