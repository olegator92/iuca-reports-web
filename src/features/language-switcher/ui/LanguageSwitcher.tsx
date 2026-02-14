import { useCallback, useEffect, useMemo, useRef, useState, useId } from "react";
import { useLocalization } from "@/app/providers/LocalizationProvider";
import { Button } from "@/shared/ui";
import { useTranslation } from "react-i18next";
import { Check, ChevronDown, Globe } from "lucide-react";
import { cn } from "@/shared/lib";

export const LanguageSwitcher = () => {
    const { t, i18n } = useTranslation();
    const { languages, isLoading, setLanguage, currentLanguage } = useLocalization();
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const listboxId = useId().concat("-language-switcher");

    const handleSelect = useCallback(
        async (language: string) => {
            setIsOpen(false);
            await setLanguage(language);
            window.requestAnimationFrame(() => {
                triggerRef.current?.focus();
            });
        },
        [setLanguage],
    );

    const resolvedLanguage = i18n.resolvedLanguage ?? currentLanguage;
    const currentLanguageOption = useMemo(
        () => languages.find(({ name }) => name === resolvedLanguage),
        [languages, resolvedLanguage],
    );
    const currentLanguageLabel =
        currentLanguageOption?.displayName ??
        resolvedLanguage?.toUpperCase() ??
        t("settings.language");
    const hasLanguages = languages.length > 0;

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const isWithinMenu = (target: EventTarget | null) => {
            if (!target) {
                return false;
            }

            const node = target as Node;
            return (
                menuRef.current?.contains(node) === true ||
                triggerRef.current?.contains(node) === true
            );
        };

        const handlePointerDown = (event: PointerEvent) => {
            if (!isWithinMenu(event.target)) {
                setIsOpen(false);
            }
        };

        const handleFocusIn = (event: FocusEvent) => {
            if (!isWithinMenu(event.target)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
                triggerRef.current?.focus();
            }
        };

        window.addEventListener("pointerdown", handlePointerDown);
        window.addEventListener("focusin", handleFocusIn);
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("pointerdown", handlePointerDown);
            window.removeEventListener("focusin", handleFocusIn);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    useEffect(() => {
        if (!hasLanguages) {
            setIsOpen(false);
        }
    }, [hasLanguages]);

    const menuItemBaseClasses =
        "flex w-full items-center justify-between gap-3 rounded-md border border-transparent px-3 py-3 md:py-2 text-sm transition hover:bg-muted/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background min-h-[48px] md:min-h-0";

    return (
        <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {t("settings.language")}
            </p>
            <div className="relative">
                <Button
                    ref={triggerRef}
                    type="button"
                    variant="outline"
                    className={cn(
                        "w-full justify-between rounded-lg border border-border/80 bg-background px-3 py-3 md:py-2 text-sm font-medium transition hover:bg-muted/40 hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[open='true']:border-brand/70 data-[open='true']:bg-muted/40 min-h-[48px] md:min-h-0",
                        !hasLanguages && "cursor-not-allowed opacity-60",
                    )}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    aria-controls={listboxId}
                    aria-busy={isLoading || undefined}
                    disabled={!hasLanguages}
                    data-open={isOpen ? "" : undefined}
                    onClick={() => {
                        if (!hasLanguages) {
                            return;
                        }

                        setIsOpen((prev) => !prev);
                    }}
                >
                    <span className="flex items-center gap-2 text-left">
                        <Globe className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        <span className="truncate">{currentLanguageLabel}</span>
                    </span>
                    <ChevronDown
                        className={cn(
                            "h-4 w-4 text-muted-foreground transition-transform",
                            isOpen && "rotate-180",
                        )}
                        aria-hidden="true"
                    />
                </Button>

                {isOpen ? (
                    <div
                        ref={menuRef}
                        id={listboxId}
                        role="listbox"
                        aria-label={t("settings.language")}
                        className="absolute left-0 top-full z-50 mt-2 w-full min-w-[200px] rounded-lg border border-border bg-popover p-1 shadow-lg"
                    >
                        {languages.map(({ name, displayName, englishName }) => {
                            const isActive = name === resolvedLanguage;

                            return (
                                <button
                                    key={name}
                                    type="button"
                                    role="option"
                                    aria-selected={isActive}
                                    className={cn(
                                        menuItemBaseClasses,
                                        isActive
                                            ? "border border-brand/60 bg-brand/10 text-foreground shadow-[0_6px_20px_rgba(0,0,0,0.05)] hover:bg-brand/15"
                                            : "text-muted-foreground",
                                    )}
                                    onClick={() => void handleSelect(name)}
                                >
                                    <span className="flex flex-col text-left">
                                        <span>{displayName}</span>
                                        {englishName && englishName !== displayName ? (
                                            <span className="text-xs text-muted-foreground/80">
                                                {englishName}
                                            </span>
                                        ) : null}
                                    </span>
                                    {isActive ? (
                                        <Check className="h-4 w-4 text-brand" aria-hidden="true" />
                                    ) : null}
                                </button>
                            );
                        })}
                    </div>
                ) : null}
            </div>
        </div>
    );
};
