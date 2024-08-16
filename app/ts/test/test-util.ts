import { parse } from "ts/data/parsing";

export const parseTestHtml = (html: string) =>
    parse(html, "https://sally.example.com");

Object.prototype.toString = () => JSON.stringify(this);
