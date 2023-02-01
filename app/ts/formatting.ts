import { compatBrowser } from "./compat";

export const formatLongDate = (date: string): string => {
    return new Date(date).toLocaleDateString(
        compatBrowser.i18n.getUILanguage(),
        {
            day: "numeric",
            month: "long",
            year: "numeric",
        }
    );
};
