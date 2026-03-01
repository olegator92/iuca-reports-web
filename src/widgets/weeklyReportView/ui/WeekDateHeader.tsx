import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, ChevronLeft, ChevronRight, StickyNote, BarChart2 } from "lucide-react";
import { Button } from "@/shared/ui";
import { cn, getWorkWeekBounds, offsetWorkWeek } from "@/shared/lib";
import type { WeeklyReportStatus } from "@/entities/weekly-report";

type ActiveTab = "dailyReports" | "weeklyReport";

interface WeekDateHeaderProps {
    currentWeekStart: string;
    currentWeekEnd: string;
    onWeekChange: (weekStart: string, weekEnd: string) => void;
    reportStatus: WeeklyReportStatus | null;
    activeTab: ActiveTab;
    onTabChange: (tab: ActiveTab) => void;
}

const formatWeekRange = (weekStart: string, weekEnd: string): string => {
    const [sy, sm, sd] = weekStart.split("-").map(Number);
    const [ey, em, ed] = weekEnd.split("-").map(Number);
    const start = new Date(Date.UTC(sy, sm - 1, sd));
    const end = new Date(Date.UTC(ey, em - 1, ed));

    const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", timeZone: "UTC" };
    const yearOpt: Intl.DateTimeFormatOptions = { year: "numeric", timeZone: "UTC" };

    return `${start.toLocaleDateString(undefined, opts)} – ${end.toLocaleDateString(undefined, { ...opts, ...yearOpt })}`;
};

const getTodayString = (): string => new Date().toISOString().split("T")[0];

export const WeekDateHeader = ({
    currentWeekStart,
    currentWeekEnd,
    onWeekChange,
    reportStatus,
    activeTab,
    onTabChange
}: WeekDateHeaderProps) => {
    const { t } = useTranslation();
    const dateInputRef = useRef<HTMLInputElement>(null);
    const today = getTodayString();

    const handlePrev = () => {
        const { weekStart, weekEnd } = offsetWorkWeek(currentWeekStart, -1);
        onWeekChange(weekStart, weekEnd);
    };

    const handleNext = () => {
        const { weekStart, weekEnd } = offsetWorkWeek(currentWeekStart, +1);
        onWeekChange(weekStart, weekEnd);
    };

    const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            const { weekStart, weekEnd } = getWorkWeekBounds(new Date(e.target.value + "T00:00:00"));
            onWeekChange(weekStart, weekEnd);
        }
    };

    const openPicker = () => {
        dateInputRef.current?.showPicker();
    };

    const isNextDisabled = currentWeekEnd >= today;

    return (
        <div className="flex flex-col bg-brand">
            {/* Week nav row */}
            <div className="flex items-center justify-between px-3 py-2 sm:px-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrev}
                    className={cn("min-h-[48px] min-w-[48px] md:min-h-9 md:min-w-9 text-white hover:bg-white/15 hover:text-white")}
                    aria-label={t("weeklyReports.dateHeader.prev")}
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>

                <button
                    type="button"
                    onClick={openPicker}
                    className="relative flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-white/15 transition-colors cursor-pointer"
                    aria-label={t("weeklyReports.dateHeader.selectDate")}
                >
                    <Calendar className="h-3.5 w-3.5 text-white/70" />
                    <span className="text-sm font-medium text-white sm:text-base">
                        {formatWeekRange(currentWeekStart, currentWeekEnd)}
                    </span>
                    <input
                        ref={dateInputRef}
                        type="date"
                        value={currentWeekStart}
                        max={today}
                        onChange={handleDateInput}
                        className="absolute inset-0 opacity-0 w-0 h-0 pointer-events-none"
                        tabIndex={-1}
                        aria-hidden="true"
                    />
                </button>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNext}
                    className={cn("min-h-[48px] min-w-[48px] md:min-h-9 md:min-w-9 text-white hover:bg-white/15 hover:text-white disabled:text-white/40")}
                    aria-label={t("weeklyReports.dateHeader.next")}
                    disabled={isNextDisabled}
                >
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>

            {/* Tab switcher row */}
            <div className="flex">
                <button
                    type="button"
                    onClick={() => onTabChange("dailyReports")}
                    className={cn(
                        "flex flex-1 cursor-pointer items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-colors",
                        activeTab === "dailyReports"
                            ? "bg-white/20 text-white"
                            : "text-white/70 hover:bg-white/15 hover:text-white"
                    )}
                >
                    <StickyNote className="h-3.5 w-3.5" />
                    {t("weeklyReports.tabs.dailyReports")}
                </button>
                <button
                    type="button"
                    onClick={() => onTabChange("weeklyReport")}
                    className={cn(
                        "flex flex-1 cursor-pointer flex-wrap items-center justify-center gap-x-1.5 gap-y-1 px-2 py-2.5 text-sm font-medium transition-colors",
                        activeTab === "weeklyReport"
                            ? "bg-white/20 text-white"
                            : "text-white/70 hover:bg-white/15 hover:text-white"
                    )}
                >
                    <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap">
                        <BarChart2 className="h-3.5 w-3.5" />
                        {t("weeklyReports.tabs.weeklyReport")}
                    </span>
                    {reportStatus === "Submitted" && (
                        <span className="rounded-full bg-green-400/30 px-1.5 py-0.5 text-[10px] font-medium text-green-100">
                            {t("weeklyReports.status.submitted")}
                        </span>
                    )}
                    {reportStatus === "InProgress" && (
                        <span className="rounded-full bg-amber-400/30 px-1.5 py-0.5 text-[10px] font-medium text-amber-100">
                            {t("weeklyReports.status.inProgress")}
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
};
