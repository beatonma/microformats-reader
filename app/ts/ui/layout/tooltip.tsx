import React, {
    ComponentProps,
    ReactNode,
    useEffect,
    useId,
    useRef,
} from "react";
import { classes } from "ts/ui/util";
import { Column } from "ts/ui/layout/linear";

interface TooltipProps extends Omit<ComponentProps<"div">, "title"> {
    tooltip: ReactNode;
}
export const Tooltip = (props: TooltipProps) => {
    const { tooltip, className, children, ...rest } = props;
    const tooltipId = useId();

    if (React.Children.count(tooltip) === 0) return <>{children}</>;
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const parent = ref.current?.parentElement;

        /**
         * Center the tooltip on its root element, adjusted to keep it
         * within the viewport boundary.
         * */
        const showTooltip = () => {
            const tooltip = ref.current;
            if (!parent) return;
            if (!tooltip) return;

            const parentBounds = parent.getBoundingClientRect();
            const bounds = tooltip.getBoundingClientRect();
            const windowWidth = document.documentElement.clientWidth;

            const halfParentWidth = parentBounds.width / 2;
            const halfTooltipWidth = bounds.width / 2;

            // Offset to center the tooltip on its parent
            let offsetLeft = halfParentWidth - halfTooltipWidth;

            // Correct tooltip position if overflowing the window bounds
            if (parentBounds.left + offsetLeft < 0) {
                // Fix overflow on left
                offsetLeft = -parentBounds.left;
            }
            const viewportRight = parentBounds.left + offsetLeft + bounds.width;
            if (viewportRight > windowWidth) {
                // Fix overflow on right
                offsetLeft = windowWidth - viewportRight - halfTooltipWidth;
            }
            tooltip.style.left = `${offsetLeft}px`;
        };
        const escapeTooltip = (el: KeyboardEvent) => {
            if (el.key === "Escape") {
                parent?.blur();
            }
        };

        parent?.addEventListener("mouseover", showTooltip);
        parent?.addEventListener("keydown", escapeTooltip);

        return () => {
            parent?.removeEventListener("mouseover", showTooltip);
            parent?.removeEventListener("keydown", escapeTooltip);
        };
    }, [ref]);

    return (
        <div
            aria-describedby={tooltipId}
            className={classes("tooltip-root", className)}
            tabIndex={0}
            {...rest}
        >
            {children}
            <div id={tooltipId} ref={ref} className="tooltip" role="tooltip">
                <Column>{tooltip}</Column>
            </div>
        </div>
    );
};
