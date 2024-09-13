import { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { _, compatBrowser } from "ts/compat";
import { init } from "ts/index";

export const initEntrypointUi = (
    titleMessageName: string,
    htmlContainerId: string,
    entrypoint: ReactNode,
) => {
    init();

    const container = document?.getElementById(htmlContainerId);
    if (container) {
        document.documentElement.lang = compatBrowser.i18n.getUILanguage();
        document.title = _(titleMessageName);

        const root = createRoot(container);
        root.render(entrypoint);
    }
};
