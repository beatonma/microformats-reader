import React, { ComponentProps, useContext } from "react";
import { compatBrowser } from "ts/compat";
import { ExpandCollapseFlagContext } from "ts/ui/layout/expand-collapse";
import { titles } from "ts/ui/util";
import { formatUri } from "ts/ui/formatting";

interface LinkProps extends Omit<ComponentProps<"a">, "href" | "onClick"> {
    href: string | null | undefined;
}

export const LinkTo = (props: LinkProps) => {
    const { children, title, href, ...rest } = props;

    if (!href) return null;
    const titleWithURL = titles(title, title?.includes(href) ? null : href);

    if (href.startsWith("#")) {
        return (
            <InternalLink
                href={href}
                title={titleWithURL}
                children={children}
                {...rest}
            />
        );
    }

    const openUrl = () =>
        compatBrowser.tabs.create({ active: true, url: href });

    return (
        <a
            href={href}
            title={titleWithURL}
            onClick={openUrl}
            children={
                React.Children.count(children) === 0
                    ? formatUri(href)
                    : children
            }
            {...rest}
        />
    );
};

const InternalLink = (props: LinkProps & { href: string }) => {
    const { href, ...rest } = props;

    const [_, expandAll] = useContext(ExpandCollapseFlagContext);
    return (
        <a
            href={href}
            onClick={() => {
                awaitComponentsExpanded(expandAll, () => {
                    // Highlight the targeted content once any expandable elements
                    // it might be hidden within are in their fully expanded state.
                    highlightElement(href.replace("#", ""))();
                });
            }}
            {...rest}
        />
    );
};

const highlightElement = (id: string): (() => void) => {
    return () => {
        const element = document.getElementById(id);
        if (!element) return;

        element.scrollIntoView({ behavior: "smooth", block: "start" });
        element.setAttribute("data-highlight-linked", "true");
        element.addEventListener(
            "animationend",
            () => element.removeAttribute("data-highlight-linked"),
            { once: true },
        );
    };
};

/**
 *
 *
 * @param init The action which triggers state changes, called as soon as observer setup is complete
 * @param callback The action which triggers once all observed components have reached their `expanded` state.
 */
const awaitComponentsExpanded = (init: () => void, callback: () => void) => {
    const attributeName = "data-expansion-state";

    const expanders = document.querySelectorAll(
        `[${attributeName}="expanding"],[${attributeName}="collapsing"],[${attributeName}="collapsed"]`,
    );

    const elementCount = expanders.length;
    if (elementCount === 0) {
        callback();
        return;
    }

    let elementsFinished = 0;
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (
                (mutation.target as HTMLElement).getAttribute(attributeName) ===
                "expanded"
            ) {
                elementsFinished += 1;
            }
        });

        if (elementsFinished === elementCount) {
            callback();
            observer.disconnect();
        }
    });
    expanders.forEach(el => {
        observer.observe(el, { attributes: true });
    });

    init();
};
