import React, {
    ComponentProps,
    ReactNode,
    useContext,
    useEffect,
    useId,
} from "react";
import { CardContent, CardLayout } from "ts/ui/layout/card";
import { DropdownButton } from "ts/ui/layout/dropdown";
import {
    animateExpandCollapse,
    ExpandableDefaultProps,
    ExpandCollapseLayout,
    invertExpansionState,
} from "ts/ui/layout/expand-collapse";
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

    const cardContentID = useId();
    const summaryId = useId();

    return (
        <ExpandCollapseLayout
            layout={({
                isExpanded,
                collapsibleControllerProps,
                collapsibleContentProps,
            }) => {
                const dataExpansionState =
                    collapsibleContentProps["data-expansion-state"];

                useEffect(() => {
                    animateExpandCollapse(summaryId, !isExpanded, () => {
                        /* Use inverted value of isExpanded, no need for separate state */
                    });
                }, [isExpanded]);

                return (
                    <>
                        <div className="expandable-card--label">
                            {microformat}
                        </div>
                        <CardLayout
                            className={classes(
                                "expandable-card",
                                microformat,
                                className,
                            )}
                            title={titles(microformat, title)}
                            {...rest}
                        >
                            <CardContent
                                id={cardContentID}
                                data-expansion-state={dataExpansionState}
                                data-expanded={isExpanded}
                                data-expanded-previous={
                                    collapsibleContentProps[
                                        "data-expanded-previous"
                                    ]
                                }
                                aria-expanded={isExpanded}
                            >
                                <ConditionalContent condition={expandable}>
                                    <DropdownButton
                                        className="expandable-card--toggle"
                                        isExpanded={isExpanded}
                                        dropdownButtonTitle={contentDescription}
                                        {...collapsibleControllerProps}
                                        aria-controls={cardContentID}
                                    />
                                </ConditionalContent>

                                <RowOrColumn
                                    layoutName={bannerLayout}
                                    className="banner"
                                    vertical={Alignment.Start}
                                    space={
                                        bannerLayout === "row"
                                            ? Space.Large
                                            : Space.None
                                    }
                                >
                                    {sharedContent}

                                    <div
                                        id={summaryId}
                                        className="summary"
                                        data-expanded={!isExpanded}
                                        data-expansion-state={invertExpansionState(
                                            dataExpansionState,
                                        )}
                                    >
                                        {summaryContent}
                                    </div>
                                </RowOrColumn>

                                <ConditionalContent condition={expandable}>
                                    <div
                                        className="detail"
                                        {...collapsibleContentProps}
                                    >
                                        {detailContent}
                                    </div>
                                </ConditionalContent>
                            </CardContent>
                        </CardLayout>
                    </>
                );
            }}
        />
    );
};
