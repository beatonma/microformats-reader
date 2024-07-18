import { compatBrowser } from "ts/compat";
import { TODO } from "ts/dev";

export interface ToolbarIconState {
    hasContent: boolean;
    badgeText?: string;
}

export const ActiveState: ToolbarIconState = {
    badgeText: "✔",
    hasContent: true,
};

export const EmptyState: ToolbarIconState = {
    hasContent: false,
};

export const applyToolbarIconState = async (
    state: ToolbarIconState,
    tabId: number | undefined,
) => {
    TODO("Retrieve badge colors from user options");
    return Promise.allSettled([
        compatBrowser.action.setBadgeText?.({
            tabId: tabId,
            text: state.badgeText ?? "",
        }),
        compatBrowser.action.setBadgeColors({
            tabId: tabId,
            background: "black",
            text: "white",
        }),
    ]);
};
