import { compatBrowser } from "ts/compat/browser";

export { compatBrowser } from "./browser";

export const _ = compatBrowser.i18n.getMessage;
