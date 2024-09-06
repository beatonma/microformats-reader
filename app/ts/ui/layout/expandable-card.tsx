import React, {
    ComponentProps,
    ReactNode,
    useContext,
    useEffect,
    useId,
    useRef,
    useState,
} from "react";
import { CardContent, CardLayout } from "ts/ui/layout/card";
import { DropdownButton } from "ts/ui/layout/dropdown";
import { ExpandableDefaultProps } from "ts/ui/layout/expand-collapse";
import { Alignment, Space } from "ts/ui/layout";
import { classes, titles } from "ts/ui/util";
import { OptionsContext } from "ts/options";
import { LinearLayout, RowOrColumn } from "ts/ui/layout/linear";
import { Microformat } from "ts/data/microformats";
import { ConditionalContent } from "ts/ui/layout/conditional";

interface ExpandableCardProps extends ExpandableDefaultProps {
    microformat: Microformat.H | null;
    expandable?: boolean;
    contentDescription?: string;
    sharedContent: ReactNode | null;
    summaryContent: ReactNode | null;
    detailContent: ReactNode | null;
}

export const ExpandableCard = (
    props: ExpandableCardProps & {
        bannerLayout?: LinearLayout;
    } & ComponentProps<"div">,
) => {
    const options = useContext(OptionsContext);
    const {
        microformat,
        expandable = true,
        contentDescription = microformat ??
            "__CANARY__missing_contentDescription",
        defaultIsExpanded = options.dropdownExpandByDefault,
        sharedContent,
        summaryContent,
        detailContent,
        className,
        title,
        bannerLayout = "row",
        ...rest
    } = props;

    const [isExpanded, setExpanded] = useState(
        expandable ? defaultIsExpanded : false,
    );
    const [isCollapsing, setIsCollapsing] = useState(false);
    const [isExpanding, setIsExpanding] = useState(false);

    const cardContentID = useId();
    const summaryRef = useRef<HTMLDivElement>(null);
    const detailRef = useRef<HTMLDivElement>(null);

    const toggleState = () => {
        const target = !isExpanded;
        setExpanded(target);
        setIsExpanding(target);
        setIsCollapsing(!target);
    };

    const onEndAnimation = () => {
        setIsExpanding(false);
        setIsCollapsing(false);
    };

    addAnimationEndListener(summaryRef.current, isExpanding, onEndAnimation);
    addAnimationEndListener(detailRef.current, isExpanding, onEndAnimation);

    return (
        <>
            <div className="expandable-card--label">{microformat}</div>
            <CardLayout
                className={classes("expandable-card", microformat, className)}
                title={titles(microformat, title)}
                {...rest}
            >
                <CardContent
                    id={cardContentID}
                    data-expanding={isExpanding}
                    data-collapsing={isCollapsing}
                    aria-expanded={isExpanded}
                >
                    <ConditionalContent condition={expandable}>
                        <DropdownButton
                            className="expandable-card--toggle"
                            isExpanded={isExpanded}
                            onClick={toggleState}
                            dropdownButtonTitle={contentDescription}
                            aria-controls={cardContentID}
                        />
                    </ConditionalContent>

                    <RowOrColumn
                        layoutName={bannerLayout}
                        className="banner"
                        vertical={Alignment.Start}
                        space={
                            bannerLayout === "row" ? Space.Large : Space.None
                        }
                    >
                        {sharedContent}

                        <div
                            ref={summaryRef}
                            className="summary"
                            data-visible={!isExpanded}
                            data-closing={isExpanding}
                        >
                            {summaryContent}
                        </div>
                    </RowOrColumn>

                    <ConditionalContent condition={expandable}>
                        <div
                            ref={detailRef}
                            className="detail"
                            data-visible={isExpanded}
                            data-closing={isCollapsing}
                        >
                            {detailContent}
                        </div>
                    </ConditionalContent>
                </CardContent>
            </CardLayout>
        </>
    );
};

const addAnimationEndListener = (
    element: HTMLElement | null,
    flag: boolean,
    onAnimationEnd: () => void,
) => {
    useEffect(() => {
        element?.addEventListener("animationend", onAnimationEnd, {
            once: true,
        });

        return () =>
            element?.removeEventListener("animationend", onAnimationEnd);
    }, [element, flag]);
};
