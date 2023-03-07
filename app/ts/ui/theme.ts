const THEME_ID = "context_theme";

interface Theme {
    vibrant: string;
    onVibrant: string;
    muted: string;
    onMuted: string;
}

export const injectTheme = (theme: Theme | null) => {
    const previous = document.getElementById(THEME_ID);
    if (previous) {
        document.removeChild(previous);
    }

    if (theme == null) return;

    const css = buildCss(theme);
    const styleElement = document.createElement("style");
    styleElement.id = THEME_ID;
    styleElement.appendChild(document.createTextNode(css));

    document.head.appendChild(styleElement);
};

const buildCss = (theme: Theme): string => {
    const newline = "\n  ";
    const rules = Object.entries(theme).map(([key, value]) => {
        const replacer = (substring: string): string =>
            `-${substring.toLowerCase()}`;

        return `--${key.replace(/([A-Z])/g, replacer)}: ${value};`;
    });
    return `:root {${newline}${rules.join(newline)}\n}`;
};
