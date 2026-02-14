import { useEffect, useLayoutEffect, type ReactNode } from "react";
import { useThemeStore, type Theme } from "./stores/themeStore";
import { syncBrandForeground } from "./syncBrandForeground";

const STORAGE_KEY = "fsdAuth-theme";

const isBrowser = typeof window !== "undefined";

const applyThemeClass = (theme: Theme) => {
    if (!isBrowser) {
        return;
    }

    const root = window.document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(theme);
};

const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

type ThemeProviderProps = {
    children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const theme = useThemeStore((state) => state.theme);
    const hasUserPreference = useThemeStore((state) => state.hasUserPreference);
    const initialize = useThemeStore((state) => state.initialize);
    const applySystemTheme = useThemeStore((state) => state.applySystemTheme);

    useIsomorphicLayoutEffect(() => {
        applyThemeClass(theme);
        syncBrandForeground();
    }, [theme]);

    useEffect(() => {
        if (!isBrowser) {
            return;
        }

        if (hasUserPreference) {
            window.localStorage.setItem(STORAGE_KEY, theme);
        }
        // Note: We don't remove the theme when hasUserPreference is false
        // This allows the stored preference to persist even when initializing with system theme
    }, [theme, hasUserPreference]);

    useEffect(() => {
        if (!isBrowser) {
            return;
        }

        const storedTheme = window.localStorage.getItem(STORAGE_KEY);

        if (storedTheme === "light" || storedTheme === "dark") {
            initialize(storedTheme, true);
            return;
        }

        // Default to dark theme
        initialize("dark", false);
    }, [initialize]);

    useEffect(() => {
        if (!isBrowser) {
            return;
        }

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const updateTheme = (matches: boolean) => {
            applySystemTheme(matches ? "dark" : "light");
        };

        if (!hasUserPreference) {
            updateTheme(mediaQuery.matches);
        }

        const listener = (event: MediaQueryListEvent) => {
            updateTheme(event.matches);
        };

        mediaQuery.addEventListener("change", listener);
        return () => {
            mediaQuery.removeEventListener("change", listener);
        };
    }, [applySystemTheme, hasUserPreference]);

    return children;
};

