import React, { ReactNode, useEffect, useId, useState } from "react";

export interface ExpandableDefaultProps {
    defaultIsExpanded?: boolean;
}

export interface ExpandCollapseProps {
    isExpanded: boolean;
    collapsibleControllerProps: CollapsibleControllerProps;
    collapsibleContentProps: CollapsibleContentProps;
}

// Properties for the button that controls expand/collapse behaviour.
interface CollapsibleControllerProps {
    "aria-controls": string;
    "aria-expanded": boolean;
    onClick: () => void;
}

// Properties for the content that is hidden/shown.
interface CollapsibleContentProps {
    id: string;
    "data-expanded": boolean;
    "data-expanded-previous": boolean;
    "data-expansion-state": ExpansionState;
    "aria-hidden": boolean;
}

interface ExpandCollapseInternalProps {
    layout: (props: ExpandCollapseProps) => ReactNode;
    children?: ReactNode | ReactNode[];
}

type ExpansionState = "expanded" | "collapsed" | "expanding" | "collapsing";
export const invertExpansionState = (state: ExpansionState): ExpansionState => {
    const states: Record<ExpansionState, ExpansionState> = {
        expanded: "collapsed",
        collapsed: "expanded",
        expanding: "collapsing",
        collapsing: "expanding",
    };
    return states[state];
};

export const ExpandCollapseLayout = (
    props: ExpandableDefaultProps & ExpandCollapseInternalProps,
) => {
    const { defaultIsExpanded, layout } = props;
    const [isExpanded, setExpanded] = useState(defaultIsExpanded ?? false);
    const [previousWasExpanded, setPreviousWasExpanded] = useState(isExpanded);
    const [expansionState, setExpansionState] = useState<ExpansionState>(
        isExpanded ? "expanded" : "collapsed",
    );
    const contentID = useId();

    useEffect(
        () => animateExpandCollapse(contentID, isExpanded, setExpansionState),
        [isExpanded],
    );

    const canExpand = props.children
        ? React.Children.count(props.children) > 0
        : true;

    const toggleState = () => {
        if (!canExpand) return;

        setExpanded(it => {
            setPreviousWasExpanded(it);
            return !it;
        });
    };

    const collapsibleControllerProps = {
        "aria-controls": contentID,
        "aria-expanded": isExpanded,
        onClick: toggleState,
    };

    const collapsibleContentProps = {
        id: contentID,
        "aria-hidden": !isExpanded,
        "data-expansion-state": expansionState,
        "data-expanded": isExpanded,
        "data-expanded-previous": previousWasExpanded,
    };

    return layout({
        isExpanded: isExpanded,
        collapsibleControllerProps: collapsibleControllerProps,
        collapsibleContentProps: collapsibleContentProps,
    });
};

export const animateExpandCollapse = (
    elementId: string,
    isExpanded: boolean,
    setExpansionState: (finalState: ExpansionState) => void,
) => {
    setExpansionState(isExpanded ? "expanding" : "collapsing");

    const element = document.getElementById(elementId);
    if (!element) return;

    if (isExpanded) {
        resize(element, 0, element.scrollHeight);
    } else {
        resize(element, element.scrollHeight, 0);
    }

    // const transition = element.style.transition;
    // element.style.transition = "";
    // requestAnimationFrame(() => {
    //     element.style.transition = transition;
    //     element.style.height = `${element.scrollHeight}px`;
    //
    //     if (!isExpanded) {
    //         requestAnimationFrame(() => {
    //             element.style.height = "0";
    //         });
    //     }
    // });

    const _onTransitionEnd = () => {
        if (isExpanded) {
            setExpansionState("expanded");
            element.style.height = "";
        } else {
            setExpansionState("collapsed");
        }
    };

    element.addEventListener("transitionend", _onTransitionEnd, {
        once: true,
    });

    return () => element.removeEventListener("transitionend", _onTransitionEnd);
};

const resize = (
    element: HTMLElement,
    startHeightPx: number,
    endHeightPx: number,
) => {
    const transition = element.style.transition;
    element.style.transition = "";
    requestAnimationFrame(() => {
        element.style.transition = transition;
        element.style.height = `${startHeightPx}px`;

        requestAnimationFrame(() => {
            element.style.height = `${endHeightPx}px`;
        });
    });
};
