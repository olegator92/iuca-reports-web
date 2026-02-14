import type { FC } from "react";
import { Moon, Sun } from "lucide-react";
import { cn, useTheme } from "@/shared/lib";
import { useTranslation } from "react-i18next";

type ThemeSwitcherProps = {
    className?: string;
};

export const ThemeSwitcher: FC<ThemeSwitcherProps> = ({ className }) => {
    const { theme, toggleTheme } = useTheme();
    const { t } = useTranslation();
    const isDark = theme === "dark";
    const modeLabel = isDark ? t("settings.themeDark") : t("settings.themeLight");

    return (
        <button
            type="button"
            role="switch"
            aria-checked={isDark}
            aria-label={t("settings.theme")}
            onClick={toggleTheme}
            className={cn(
                "inline-flex w-full cursor-pointer items-center justify-between gap-3 rounded-md border border-border px-3 py-3 md:py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background min-h-[48px] md:min-h-0",
                isDark
                    ? "bg-muted/40 text-foreground hover:bg-muted/30"
                    : "bg-secondary text-foreground hover:bg-secondary/80",
                className,
            )}
        >
            <span className="flex items-center gap-2">
                {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <span>{modeLabel}</span>
            </span>
            <span
                aria-hidden="true"
                className={cn(
                    "relative inline-flex h-5 w-10 flex-shrink-0 items-center rounded-full transition-[background-color]",
                    isDark ? "bg-brand/80" : "bg-brand/30",
                )}
            >
                <span
                    className={cn(
                        "absolute left-1 top-1 size-3 rounded-full border bg-background transition-transform",
                        isDark
                            ? "translate-x-4 border-brand/60"
                            : "border-brand/40",
                    )}
                />
            </span>
        </button>
    );
};
