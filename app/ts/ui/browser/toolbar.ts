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

    const iconName = state.hasContent ? "vibrant" : "muted";

    return Promise.allSettled([
        compatBrowser.action.setIcon({
            tabId: tabId,
            path: [16, 32, 48, 128].reduce((previous: any, current: number) => {
                previous[`${current}`] = `icon/${iconName}-${current}.png`;
                return previous;
            }, {}),
        }),
        compatBrowser.action.setBadgeText?.({
            tabId: tabId,
            text: state.badgeText ?? "",
        }),
        compatBrowser.action.setBadgeColors({
            tabId: tabId,
            background: "#000000",
            text: "#ffffff",
        }),
    ]);
};
