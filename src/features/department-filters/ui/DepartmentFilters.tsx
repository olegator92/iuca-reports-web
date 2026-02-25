import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Badge, Combobox, Label } from "@/shared/ui";
import type { ComboboxOption } from "@/shared/ui";
import { X, Filter, ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import type { DepartmentSortField } from "@/entities/department/model";

type ExpandedPanel = "none" | "filters" | "sorting";

interface DepartmentFiltersProps {
    includeDeleted: boolean;
    sortBy: DepartmentSortField | null;
    sortDescending: boolean;
    onIncludeDeletedChange: (value: boolean) => void;
    onSortChange: (field: DepartmentSortField | null, descending: boolean) => void;
    onResetFilters: () => void;
}

export const DepartmentFilters = ({
    includeDeleted,
    sortBy,
    sortDescending,
    onIncludeDeletedChange,
    onSortChange,
    onResetFilters,
}: DepartmentFiltersProps) => {
    const { t } = useTranslation();
    const [expandedPanel, setExpandedPanel] = useState<ExpandedPanel>("none");

    const hasActiveFilters = includeDeleted;
    const hasActiveSorting = sortBy !== null;
    const hasAnyActive = hasActiveFilters || hasActiveSorting;

    const deletedOptions: ComboboxOption[] = useMemo(() => [
        { value: "exclude", label: t("templateFilters.excludeDeleted") },
        { value: "include", label: t("departments.includeDeleted") },
    ], [t]);

    const sortFieldOptions: ComboboxOption[] = useMemo(() => [
        { value: "none", label: t("templateFilters.sortFieldNone") },
        { value: "name", label: t("departments.sortByName") },
        { value: "createdAt", label: t("departments.sortByCreatedAt") },
        { value: "updatedAt", label: t("departments.sortByUpdatedAt") },
    ], [t]);

    const sortDirectionOptions: ComboboxOption[] = useMemo(() => [
        { value: "asc", label: t("templateFilters.ascending") },
        { value: "desc", label: t("templateFilters.descending") },
    ], [t]);

    const handleDeletedChange = (value: string) => {
        onIncludeDeletedChange(value === "include");
    };

    const handleSortFieldChange = (value: string) => {
        if (value === "none") {
            onSortChange(null, false);
        } else {
            onSortChange(value as DepartmentSortField, sortDescending);
        }
    };

    const handleSortDirectionChange = (value: string) => {
        onSortChange(sortBy, value === "desc");
    };

    const togglePanel = (panel: "filters" | "sorting") => {
        setExpandedPanel(prev => prev === panel ? "none" : panel);
    };

    const getSortLabel = () => {
        if (!sortBy) return null;
        const fieldOption = sortFieldOptions.find(opt => opt.value === sortBy);
        const directionOption = sortDirectionOptions.find(opt => opt.value === (sortDescending ? "desc" : "asc"));
        return `${fieldOption?.label} (${directionOption?.label})`;
    };

    const isFiltersExpanded = expandedPanel === "filters";
    const isSortingExpanded = expandedPanel === "sorting";
    const isAnyExpanded = expandedPanel !== "none";

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => togglePanel("filters")}
                        className={`flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer ${
                            isFiltersExpanded
                                ? "text-foreground bg-muted px-2 py-1 rounded-md"
                                : "text-foreground hover:text-foreground/80"
                        }`}
                    >
                        <Filter className="h-4 w-4" />
                        <span className="hidden sm:block">{t("templateFilters.tabFilters")}</span>
                        {isFiltersExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )}
                        {hasActiveFilters && !isFiltersExpanded && (
                            <Badge variant="secondary" className="ml-1 text-xs">1</Badge>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => togglePanel("sorting")}
                        className={`flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer ${
                            isSortingExpanded
                                ? "text-foreground bg-muted px-2 py-1 rounded-md"
                                : "text-foreground hover:text-foreground/80"
                        }`}
                    >
                        <ArrowUpDown className="h-4 w-4" />
                        <span className="hidden sm:block">{t("templateFilters.tabSorting")}</span>
                        {isSortingExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )}
                        {hasActiveSorting && !isSortingExpanded && (
                            <Badge variant="secondary" className="ml-1 text-xs">1</Badge>
                        )}
                    </button>
                </div>

                {hasAnyActive && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onResetFilters}
                        className="h-7 px-2 text-xs"
                    >
                        <X className="h-3 w-3 mr-1" />
                        {t("templateFilters.resetFilters")}
                    </Button>
                )}
            </div>

            {isFiltersExpanded && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                        <Label className="text-xs font-medium">
                            {t("departments.includeDeleted")}
                        </Label>
                        <Combobox
                            value={includeDeleted ? "include" : "exclude"}
                            onChange={handleDeletedChange}
                            options={deletedOptions}
                            aria-label={t("departments.includeDeleted")}
                        />
                    </div>
                </div>
            )}

            {isSortingExpanded && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                        <Label className="text-xs font-medium">
                            {t("templateFilters.sortField")}
                        </Label>
                        <Combobox
                            value={sortBy ?? "none"}
                            onChange={handleSortFieldChange}
                            options={sortFieldOptions}
                            aria-label={t("templateFilters.sortField")}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-medium">
                            {t("templateFilters.sortDirection")}
                        </Label>
                        <Combobox
                            value={sortDescending ? "desc" : "asc"}
                            onChange={handleSortDirectionChange}
                            options={sortDirectionOptions}
                            disabled={!sortBy}
                            aria-label={t("templateFilters.sortDirection")}
                        />
                    </div>
                </div>
            )}

            {hasAnyActive && isAnyExpanded && (
                <div className="flex flex-wrap gap-2 pt-2">
                    <span className="text-xs text-muted-foreground">
                        {t("templateFilters.activeFilters")}:
                    </span>
                    {sortBy && (
                        <Badge variant="secondary" className="text-xs">
                            {getSortLabel()}
                            <button
                                type="button"
                                onClick={() => onSortChange(null, false)}
                                className="ml-1 rounded-sm hover:bg-muted/50 p-0.5"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                    {includeDeleted && (
                        <Badge variant="secondary" className="text-xs">
                            {t("departments.includeDeleted")}
                            <button
                                type="button"
                                onClick={() => onIncludeDeletedChange(false)}
                                className="ml-1 rounded-sm hover:bg-muted/50 p-0.5"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                </div>
            )}
        </div>
    );
};
