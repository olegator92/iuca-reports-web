import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib";

interface SupervisorReportHeaderProps {
    dateFrom: string;
    dateTo: string;
    isNextDisabled: boolean;
    onDateRangeChange: (from: string, to: string) => void;
    onPrev: () => void;
    onNext: () => void;
    onToggleFilter?: () => void;
    activeFilterCount?: number;
}

const formatDate = (dateStr: string): string => {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
    });
};

export const SupervisorReportHeader = ({
    dateFrom,
    dateTo,
    isNextDisabled,
    onDateRangeChange,
    onPrev,
    onNext,
    onToggleFilter,
    activeFilterCount = 0,
}: SupervisorReportHeaderProps) => {
    const { t } = useTranslation();
    const fromInputRef = useRef<HTMLInputElement>(null);
    const toInputRef = useRef<HTMLInputElement>(null);

    const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) return;
        const newFrom = e.target.value;
        onDateRangeChange(newFrom, newFrom > dateTo ? newFrom : dateTo);
    };

    const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) return;
        const newTo = e.target.value;
        onDateRangeChange(newTo < dateFrom ? newTo : dateFrom, newTo);
    };

    return (
        <div className="flex items-center justify-between bg-brand px-3 py-2 sm:px-4">
            {/* Prev */}
            <Button
                variant="ghost"
                size="icon"
                onClick={onPrev}
                className={cn(
                    "min-h-[48px] min-w-[48px] md:min-h-9 md:min-w-9",
                    "text-white hover:bg-white/15 hover:text-white"
                )}
                aria-label={t("supervisorReports.dateHeader.prev")}
            >
                <ChevronLeft className="h-5 w-5" />
            </Button>

            {/* Independent date pickers */}
            <div className="flex items-center gap-1.5">
                {/* From date */}
                <button
                    type="button"
                    onClick={() => fromInputRef.current?.showPicker()}
                    className="relative rounded-md px-2 py-1 hover:bg-white/15 transition-colors cursor-pointer"
                    aria-label={t("supervisorReports.dateHeader.selectFrom")}
                >
                    <span className="text-sm font-medium text-white sm:text-base">
                        {formatDate(dateFrom)}
                    </span>
                    <input
                        ref={fromInputRef}
                        type="date"
                        value={dateFrom}
                        onChange={handleFromChange}
                        className="absolute inset-0 opacity-0 w-0 h-0 pointer-events-none"
                        tabIndex={-1}
                        aria-hidden="true"
                    />
                </button>

                <span className="text-white/60 text-sm select-none">–</span>

                {/* To date */}
                <button
                    type="button"
                    onClick={() => toInputRef.current?.showPicker()}
                    className="relative rounded-md px-2 py-1 hover:bg-white/15 transition-colors cursor-pointer"
                    aria-label={t("supervisorReports.dateHeader.selectTo")}
                >
                    <span className="text-sm font-medium text-white sm:text-base">
                        {formatDate(dateTo)}
                    </span>
                    <input
                        ref={toInputRef}
                        type="date"
                        value={dateTo}
                        onChange={handleToChange}
                        className="absolute inset-0 opacity-0 w-0 h-0 pointer-events-none"
                        tabIndex={-1}
                        aria-hidden="true"
                    />
                </button>
            </div>

            <div className="flex items-center gap-1">
                {/* Next */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onNext}
                    disabled={isNextDisabled}
                    className={cn(
                        "min-h-[48px] min-w-[48px] md:min-h-9 md:min-w-9",
                        "text-white hover:bg-white/15 hover:text-white disabled:text-white/40"
                    )}
                    aria-label={t("supervisorReports.dateHeader.next")}
                >
                    <ChevronRight className="h-5 w-5" />
                </Button>

                {/* Filter button — mobile only */}
                {onToggleFilter && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggleFilter}
                        className={cn(
                            "md:hidden min-h-[48px] min-w-[48px]",
                            "relative text-white hover:bg-white/15 hover:text-white"
                        )}
                        aria-label={t("supervisorReports.filterDepartments")}
                    >
                        <SlidersHorizontal className="h-5 w-5" />
                        {activeFilterCount > 0 && (
                            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-bold text-brand leading-none">
                                {activeFilterCount}
                            </span>
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
};
