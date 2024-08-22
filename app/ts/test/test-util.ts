import { parse } from "ts/data/parsing";
import { init } from "ts/index";

export const parseTestHtml = (html: string) =>
    parse(html, "https://sally.example.com");

const testInit = () => {
    init();
    Object.prototype.toString = () => JSON.stringify(this);
};

testInit();
