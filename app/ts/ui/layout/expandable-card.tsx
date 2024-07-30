import React, {
    HTMLProps,
    ReactNode,
    useContext,
    useEffect,
    useId,
    useState,
} from "react";
import { CardContent, CardLayout } from "ts/ui/layout/card";
import { DropdownButton } from "ts/ui/layout/dropdown";
import { ExpandableDefaultProps } from "ts/ui/layout/expand-collapse";
import { Alignment, Row, Space } from "ts/ui/layout";
import { classes } from "ts/ui/util";
import { OptionsContext } from "ts/options";

interface ExpandableCardProps extends ExpandableDefaultProps {
    contentDescription: string;
    sharedContent: ReactNode | null;
    summaryContent: ReactNode | null;
    detailContent: ReactNode | null;
}

export const ExpandableCard = (
    props: ExpandableCardProps & HTMLProps<HTMLDivElement>,
) => {
    const {
        contentDescription,
        defaultIsExpanded,
        sharedContent,
        summaryContent,
        detailContent,
        className,
        ...rest
    } = props;

    const options = useContext(OptionsContext);
    const [isExpanded, setExpanded] = useState(
        defaultIsExpanded ?? options.dropdownExpandByDefault,
    );
    const [isCollapsing, setIsCollapsing] = useState(false);
    const [isExpanding, setIsExpanding] = useState(false);

    const cardContentID = useId();
    const summaryID = useId();
    const detailID = useId();

    const toggleState = () => {
        const target = !isExpanded;
        setExpanded(target);
        setIsExpanding(target);
        setIsCollapsing(!target);
    };

    const endAnimation = () => {
        setIsExpanding(false);
        setIsCollapsing(false);
    };

    addAnimationEndListener(summaryID, isExpanding, endAnimation);
    addAnimationEndListener(detailID, isCollapsing, endAnimation);

    return (
        <CardLayout className={classes("expandable-card", className)} {...rest}>
            <CardContent
                id={cardContentID}
                data-expanding={isExpanding}
                data-collapsing={isCollapsing}
                aria-expanded={isExpanded}
            >
                <Row
                    className="banner"
                    vertical={Alignment.Start}
                    space={Space.Large}
                >
                    {sharedContent}

                    <div
                        id={summaryID}
                        className="summary"
                        data-visible={!isExpanded}
                        data-closing={isExpanding}
                    >
                        {summaryContent}
                    </div>
                </Row>

                <DropdownButton
                    title={contentDescription}
                    className="toggle-detail"
                    isExpanded={isExpanded}
                    onClick={toggleState}
                    aria-controls={cardContentID}
                />

                <div
                    id={detailID}
                    className="detail"
                    data-visible={isExpanded}
                    data-closing={isCollapsing}
                >
                    {detailContent}
                </div>
            </CardContent>
        </CardLayout>
    );
};

const addAnimationEndListener = (
    id: string,
    isCollapsing: boolean,
    reset: () => void,
) => {
    useEffect(() => {
        if (isCollapsing) {
            document.getElementById(id)?.addEventListener(
                "animationend",
                () => {
                    reset();
                },
                {
                    once: true,
                },
            );
        }
    }, [isCollapsing]);
};
