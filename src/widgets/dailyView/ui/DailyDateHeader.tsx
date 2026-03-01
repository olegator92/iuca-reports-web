import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, ChevronLeft, ChevronRight, MessageSquare, FileText } from "lucide-react";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib";
import type { DailyReportStatus } from "@/entities/daily-report";

export type DailyActiveTab = "notes" | "report";

interface DailyDateHeaderProps {
    currentDate: string;
    onDateChange: (date: string) => void;
    onPrevDay: () => void;
    onNextDay: () => void;
    isNextDayDisabled: boolean;
    reportStatus: DailyReportStatus | null;
    activeTab: DailyActiveTab;
    onTabChange: (tab: DailyActiveTab) => void;
}

const formatDate = (dateStr: string): string => {
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    return date.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
    });
};

const getTodayString = (): string => new Date().toISOString().split("T")[0];

export const DailyDateHeader = ({
    currentDate,
    onDateChange,
    onPrevDay,
    onNextDay,
    isNextDayDisabled,
    reportStatus,
    activeTab,
    onTabChange,
}: DailyDateHeaderProps) => {
    const { t } = useTranslation();
    const dateInputRef = useRef<HTMLInputElement>(null);
    const today = getTodayString();

    const openPicker = () => {
        dateInputRef.current?.showPicker();
    };

    return (
        <div className="flex flex-col bg-brand">
            {/* Date nav row */}
            <div className="flex items-center justify-between px-3 py-2 sm:px-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onPrevDay}
                    className="min-h-[48px] min-w-[48px] md:min-h-9 md:min-w-9 text-white hover:bg-white/15 hover:text-white"
                    aria-label={t("dailyReports.dateHeader.prev")}
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>

                <button
                    type="button"
                    onClick={openPicker}
                    className="relative flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-white/15 transition-colors cursor-pointer"
                    aria-label={t("dailyReports.dateHeader.selectDate")}
                >
                    <Calendar className="h-3.5 w-3.5 text-white/70" />
                    <span className="text-sm font-medium text-white sm:text-base">
                        {formatDate(currentDate)}
                    </span>
                    <input
                        ref={dateInputRef}
                        type="date"
                        value={currentDate}
                        max={today}
                        onChange={(e) => e.target.value && onDateChange(e.target.value)}
                        className="absolute inset-0 opacity-0 w-0 h-0 pointer-events-none"
                        tabIndex={-1}
                        aria-hidden="true"
                    />
                </button>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onNextDay}
                    className="min-h-[48px] min-w-[48px] md:min-h-9 md:min-w-9 text-white hover:bg-white/15 hover:text-white disabled:text-white/40"
                    aria-label={t("dailyReports.dateHeader.next")}
                    disabled={isNextDayDisabled}
                >
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>

            {/* Tab switcher row */}
            <div className="flex">
                <button
                    type="button"
                    onClick={() => onTabChange("notes")}
                    className={cn(
                        "flex flex-1 cursor-pointer items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-colors",
                        activeTab === "notes"
                            ? "bg-white/20 text-white"
                            : "text-white/70 hover:bg-white/15 hover:text-white"
                    )}
                >
                    <MessageSquare className="h-3.5 w-3.5" />
                    {t("dailyReports.tabs.dailyNotes")}
                </button>
                <button
                    type="button"
                    onClick={() => onTabChange("report")}
                    className={cn(
                        "flex flex-1 cursor-pointer flex-wrap items-center justify-center gap-x-1.5 gap-y-1 px-2 py-2.5 text-sm font-medium transition-colors",
                        activeTab === "report"
                            ? "bg-white/20 text-white"
                            : "text-white/70 hover:bg-white/15 hover:text-white"
                    )}
                >
                    <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap">
                        <FileText className="h-3.5 w-3.5" />
                        {t("dailyReports.tabs.dailyReport")}
                    </span>
                    {reportStatus === "Submitted" && (
                        <span className="rounded-full bg-green-400/30 px-1.5 py-0.5 text-[10px] font-medium text-green-100">
                            {t("dailyReports.status.submitted")}
                        </span>
                    )}
                    {reportStatus === "InProgress" && (
                        <span className="rounded-full bg-amber-400/30 px-1.5 py-0.5 text-[10px] font-medium text-amber-100">
                            {t("dailyReports.status.inProgress")}
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
};
