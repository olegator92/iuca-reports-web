import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetRolesQuery } from "@/entities/role/api";
import { Button, Badge, Combobox, Label } from "@/shared/ui";
import type { ComboboxOption } from "@/shared/ui";
import { X, Filter, ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import type { UserSortField } from "@/entities/user/model";

type ExpandedPanel = "none" | "filters" | "sorting";

interface UserFiltersProps {
    filterIsActive: boolean | null;
    filterRoleName: string | null;
    sortBy: UserSortField | null;
    sortDescending: boolean;
    onFilterIsActiveChange: (value: boolean | null) => void;
    onFilterRoleNameChange: (value: string | null) => void;
    onSortChange: (field: UserSortField | null, descending: boolean) => void;
    onResetFilters: () => void;
}

export const UserFilters = ({
    filterIsActive,
    filterRoleName,
    sortBy,
    sortDescending,
    onFilterIsActiveChange,
    onFilterRoleNameChange,
    onSortChange,
    onResetFilters,
}: UserFiltersProps) => {
    const { t } = useTranslation();
    const { data: roles = [], isLoading: isLoadingRoles } = useGetRolesQuery();
    const [expandedPanel, setExpandedPanel] = useState<ExpandedPanel>("none");

    const hasActiveFilters = filterIsActive !== null || filterRoleName !== null;
    const hasActiveSorting = sortBy !== null;
    const hasAnyActive = hasActiveFilters || hasActiveSorting;

    const activeFiltersCount = [filterIsActive !== null, filterRoleName !== null].filter(Boolean).length;

    const statusOptions: ComboboxOption[] = useMemo(() => [
        { value: "all", label: t("userFilters.all") },
        { value: "active", label: t("userFilters.activeOnly") },
        { value: "inactive", label: t("userFilters.inactiveOnly") },
    ], [t]);

    const roleOptions: ComboboxOption[] = useMemo(() => [
        { value: "", label: t("userFilters.allRoles") },
        ...roles.map((role) => ({
            value: role.name,
            label: role.name,
        })),
    ], [roles, t]);

    const sortFieldOptions: ComboboxOption[] = useMemo(() => [
        { value: "none", label: t("userFilters.sortFieldNone") },
        { value: "fullName", label: t("userFilters.sortFieldName") },
        { value: "email", label: t("userFilters.sortFieldEmail") },
        { value: "createdAt", label: t("userFilters.sortFieldCreated") },
    ], [t]);

    const sortDirectionOptions: ComboboxOption[] = useMemo(() => [
        { value: "asc", label: t("userFilters.ascending") },
        { value: "desc", label: t("userFilters.descending") },
    ], [t]);

    const handleStatusChange = (value: string) => {
        if (value === "all") {
            onFilterIsActiveChange(null);
        } else if (value === "active") {
            onFilterIsActiveChange(true);
        } else if (value === "inactive") {
            onFilterIsActiveChange(false);
        }
    };

    const handleRoleChange = (value: string) => {
        onFilterRoleNameChange(value === "" ? null : value);
    };

    const handleSortFieldChange = (value: string) => {
        if (value === "none") {
            onSortChange(null, false);
        } else {
            onSortChange(value as UserSortField, sortDescending);
        }
    };

    const handleSortDirectionChange = (value: string) => {
        onSortChange(sortBy, value === "desc");
    };

    const getStatusValue = () => {
        if (filterIsActive === null) return "all";
        return filterIsActive ? "active" : "inactive";
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
            {/* Header with Filters, Sorting, and Reset buttons */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    {/* Filters Button */}
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
                        <span className="hidden sm:block">{t("userFilters.tabFilters")}</span>
                        {isFiltersExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )}
                        {hasActiveFilters && !isFiltersExpanded && (
                            <Badge variant="secondary" className="ml-1 text-xs">
                                {activeFiltersCount}
                            </Badge>
                        )}
                    </button>

                    {/* Sorting Button */}
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
                        <span className="hidden sm:block">{t("userFilters.tabSorting")}</span>
                        {isSortingExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )}
                        {hasActiveSorting && !isSortingExpanded && (
                            <Badge variant="secondary" className="ml-1 text-xs">
                                1
                            </Badge>
                        )}
                    </button>
                </div>

                {/* Reset Button */}
                {hasAnyActive && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onResetFilters}
                        className="h-7 px-2 text-xs"
                    >
                        <X className="h-3 w-3 mr-1" />
                        {t("userFilters.resetFilters")}
                    </Button>
                )}
            </div>

            {/* Filters Panel */}
            {isFiltersExpanded && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Account Status Filter */}
                    <div className="space-y-2">
                        <Label htmlFor="status-filter" className="text-xs font-medium">
                            {t("userFilters.accountStatus")}
                        </Label>
                        <Combobox
                            value={getStatusValue()}
                            onChange={handleStatusChange}
                            options={statusOptions}
                            aria-label={t("userFilters.accountStatus")}
                        />
                    </div>

                    {/* Role Filter */}
                    <div className="space-y-2">
                        <Label htmlFor="role-filter" className="text-xs font-medium">
                            {t("userFilters.role")}
                        </Label>
                        <Combobox
                            value={filterRoleName || ""}
                            onChange={handleRoleChange}
                            options={roleOptions}
                            disabled={isLoadingRoles}
                            aria-label={t("userFilters.role")}
                        />
                    </div>
                </div>
            )}

            {/* Sorting Panel */}
            {isSortingExpanded && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                        <Label htmlFor="sort-field" className="text-xs font-medium">
                            {t("userFilters.sortField")}
                        </Label>
                        <Combobox
                            value={sortBy ?? "none"}
                            onChange={handleSortFieldChange}
                            options={sortFieldOptions}
                            aria-label={t("userFilters.sortField")}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="sort-direction" className="text-xs font-medium">
                            {t("userFilters.sortDirection")}
                        </Label>
                        <Combobox
                            value={sortDescending ? "desc" : "asc"}
                            onChange={handleSortDirectionChange}
                            options={sortDirectionOptions}
                            disabled={!sortBy}
                            aria-label={t("userFilters.sortDirection")}
                        />
                    </div>
                </div>
            )}

            {/* Active Filters Summary */}
            {hasAnyActive && isAnyExpanded && (
                <div className="flex flex-wrap gap-2 pt-2">
                    <span className="text-xs text-muted-foreground">
                        {t("userFilters.activeFilters")}:
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
                    {filterIsActive !== null && (
                        <Badge variant="secondary" className="text-xs">
                            {filterIsActive ? t("userFilters.activeOnly") : t("userFilters.inactiveOnly")}
                            <button
                                type="button"
                                onClick={() => onFilterIsActiveChange(null)}
                                className="ml-1 rounded-sm hover:bg-muted/50 p-0.5"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                    {filterRoleName && (
                        <Badge variant="secondary" className="text-xs">
                            {t("userFilters.role")}: {filterRoleName}
                            <button
                                type="button"
                                onClick={() => onFilterRoleNameChange(null)}
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
