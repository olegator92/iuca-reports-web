import { create } from "zustand";
import { persist } from "zustand/middleware";

type SidebarStoreState = {
    collapsedGroups: Record<string, boolean>;
    toggleGroup: (groupId: string) => void;
    expandGroup: (groupId: string) => void;
    collapseGroup: (groupId: string) => void;
    isGroupCollapsed: (groupId: string) => boolean;
};

export const useSidebarStore = create<SidebarStoreState>()(
    persist(
        (set, get) => ({
            collapsedGroups: {},
            toggleGroup: (groupId) => {
                set((state) => ({
                    collapsedGroups: {
                        ...state.collapsedGroups,
                        [groupId]: !state.collapsedGroups[groupId]
                    }
                }));
            },
            expandGroup: (groupId) => {
                set((state) => ({
                    collapsedGroups: {
                        ...state.collapsedGroups,
                        [groupId]: false
                    }
                }));
            },
            collapseGroup: (groupId) => {
                set((state) => ({
                    collapsedGroups: {
                        ...state.collapsedGroups,
                        [groupId]: true
                    }
                }));
            },
            isGroupCollapsed: (groupId) => {
                return get().collapsedGroups[groupId] ?? true; // Default to collapsed
            }
        }),
        {
            name: "fsd-auth-sidebar-state"
        }
    )
);
