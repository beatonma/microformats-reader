import React, {ReactNode, useEffect, useId, useState} from "react";

export interface ExpandableDefaultProps {
    defaultIsExpanded?: boolean;
}

export interface ExpandCollapseProps {
    isExpanded: boolean;
    isClosing: boolean;
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
    "data-closing": boolean;
    "aria-hidden": boolean;
}

interface ExpandCollapseInternalProps {
    child: (props: ExpandCollapseProps) => ReactNode;
}

export const ExpandCollapseLayout = (
    props: ExpandableDefaultProps & ExpandCollapseInternalProps
) => {
    const { defaultIsExpanded, child } = props;
    const [isExpanded, setExpanded] = useState(defaultIsExpanded ?? false);
    const [isClosing, setClosing] = useState(false);
    const contentID = useId();

    const toggleState = () => {
        const target = !isExpanded;
        setExpanded(target);
        if (!target) {
            setClosing(true);
        }
    };

    const collapsibleControllerProps = {
        "aria-controls": contentID,
        "aria-expanded": isExpanded,
        onClick: toggleState,
    };

    const collapsibleContentProps = {
        id: contentID,
        "data-expanded": isExpanded,
        "data-closing": isClosing,
        "aria-hidden": !isExpanded,
    };

    useEffect(() => {
        if (isClosing) {
            document
                ?.getElementById(contentID)
                ?.addEventListener("animationend", () => setClosing(false), {
                    once: true,
                });
        }
    }, [isClosing]);

    return (
        <>
            {child({
                isExpanded: isExpanded,
                isClosing: isClosing,
                collapsibleControllerProps: collapsibleControllerProps,
                collapsibleContentProps: collapsibleContentProps,
            })}
        </>
    );
};
