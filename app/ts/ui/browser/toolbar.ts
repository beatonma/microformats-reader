import { compatBrowser } from "ts/compat";

interface ToolbarIconState {
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

export const applyToolbarIconState = async (state: ToolbarIconState) => {
    const currentTab = await compatBrowser.tabs.currentTab();
    const tabId = currentTab?.id;

    compatBrowser.action.setBadgeText?.({
        tabId: tabId,
        text: state.badgeText ?? "",
    });

    compatBrowser.action.setBadgeColors({
        tabId: tabId,
        background: "black",
        text: "white",
    });
};
