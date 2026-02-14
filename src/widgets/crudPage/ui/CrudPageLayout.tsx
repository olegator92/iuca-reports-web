import type { ReactNode } from "react";
import { cn } from "@/shared/lib";
import { Button, Input } from "@/shared/ui";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CrudPageLayoutProps {
    title: string;
    subtitle?: string;
    quantity: {
        loaded: number;
        total: number;
        label?: string;
    };
    searchValue: string;
    onSearchChange: (value: string) => void;
    onSearchClear?: () => void;
    searchPlaceholder?: string;
    filtersSlot?: ReactNode;
    headerActions?: ReactNode;
    children: ReactNode;
    className?: string;
}

export const CrudPageLayout = ({
    title,
    subtitle,
    quantity,
    searchValue,
    onSearchChange,
    onSearchClear,
    searchPlaceholder,
    filtersSlot,
    headerActions,
    children,
    className,
}: CrudPageLayoutProps) => {
    const { t } = useTranslation();
    const quantityLabel = quantity.label ?? t("common.showing");
    const resolvedSearchPlaceholder =
        searchPlaceholder ?? t("common.searchPlaceholder");
    const quantityText = t("common.showingCount", {
        label: quantityLabel,
        loaded: quantity.loaded,
        total: quantity.total,
    });

    return (
        <div
            className={cn(
                "mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-10 pt-6 sm:px-6 lg:px-8",
                className,
            )}
        >
            <header className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
                        {title}
                    </h1>
                    {subtitle ? (
                        <p className="text-sm text-muted-foreground sm:text-base">
                            {subtitle}
                        </p>
                    ) : null}
                </div>
            </header>

            {filtersSlot ? (
                <section
                    aria-label={t("common.filters")}
                    className="rounded-xl border border-dashed border-border/70 bg-card px-4 py-6 text-sm text-muted-foreground"
                >
                    {filtersSlot}
                </section>
            ) : null}

            <div className="-mx-4 bg-background/95 px-4 py-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-md lg:max-w-lg">
                        <Input
                            value={searchValue}
                            aria-label={t("common.searchAria")}
                            placeholder={resolvedSearchPlaceholder}
                            onChange={(event) => onSearchChange(event.target.value)}
                            className="h-12 md:h-11 w-full rounded-md border border-border/70 bg-background pr-10 text-sm focus-visible:ring-2 focus-visible:ring-ring"
                        />
                        {searchValue && (
                            <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                onClick={onSearchClear}
                                className="absolute right-1.5 top-1/2 h-9 w-9 md:h-8 md:w-8 -translate-y-1/2 rounded-md text-muted-foreground hover:text-foreground"
                                aria-label={t("common.clearSearch")}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                    {headerActions ? (
                        <div className="flex w-full sm:w-auto">{headerActions}</div>
                    ) : null}
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <span className="self-end text-xs font-medium uppercase tracking-wide text-muted-foreground sm:text-sm">
                    {quantityText}
                </span>
                <div className="flex flex-col gap-4">{children}</div>
            </div>
        </div>
    );
};
