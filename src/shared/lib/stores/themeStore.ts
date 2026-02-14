import { create } from "zustand";

export type Theme = "light" | "dark";

type ThemeStoreState = {
    theme: Theme;
    hasUserPreference: boolean;
    initialize: (theme: Theme, hasUserPreference: boolean) => void;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
    applySystemTheme: (theme: Theme) => void;
};

export const useThemeStore = create<ThemeStoreState>((set, get) => ({
    theme: "dark",
    hasUserPreference: false,
    initialize: (theme, hasUserPreference) => {
        set({
            theme,
            hasUserPreference
        });
    },
    setTheme: (theme) => {
        set({
            theme,
            hasUserPreference: true
        });
    },
    toggleTheme: () => {
        set((state) => ({
            theme: state.theme === "dark" ? "light" : "dark",
            hasUserPreference: true
        }));
    },
    applySystemTheme: (theme) => {
        const state = get();
        if (state.hasUserPreference || state.theme === theme) {
            return;
        }

        set({ theme });
    }
}));

export const useTheme = () =>
    useThemeStore((state) => ({
        theme: state.theme,
        setTheme: state.setTheme,
        toggleTheme: state.toggleTheme
    }));
