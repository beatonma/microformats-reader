import React from "react";
import { Microformat } from "ts/data/microformats";
import { EmbeddedHCard as EmbeddedHCardData } from "ts/data/types/h-card";
import { ExpandCollapseLayout } from "ts/ui/layout/expand-collapse";
import { PropertyRow } from "ts/ui/microformats/common/properties";
import { EmbeddedHCardDialog } from "ts/ui/microformats/h-card/h-card";

interface AuthorProps {
    author: EmbeddedHCardData | null;
}
export const Author = (props: AuthorProps) => {
    const { author } = props;
    if (author == null) return null;

    return (
        <ExpandCollapseLayout
            layout={state => {
                return (
                    <div className="author-wrapper">
                        <div {...state.collapsibleControllerProps}>
                            <PropertyRow
                                microformat={Microformat.P.Author}
                                value={{ displayValue: author.name }}
                            />
                        </div>

                        <div {...state.collapsibleContentProps}>
                            {
                                <EmbeddedHCardDialog
                                    {...author}
                                    open={state.isExpanded}
                                    onClose={() => state.setState(false)}
                                />
                            }
                        </div>
                    </div>
                );
            }}
        />
    );
};
