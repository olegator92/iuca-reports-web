import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Calendar, ChevronLeft, ChevronRight, StickyNote, BarChart2 } from "lucide-react";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib";
import { ROUTES } from "@/shared/config/routes";
import { useAppDispatch, useAppSelector } from "@/app/stores/mainStore/hooks";
import { setCurrentDate as setNoteCurrentDate, setCurrentPosition as setNoteCurrentPosition } from "@/entities/daily-note";
import type { DailyReportStatus } from "@/entities/daily-report";

interface ReportDateHeaderProps {
    currentDate: string;
    onDateChange: (date: string) => void;
    reportStatus?: DailyReportStatus | null;
}

const formatDate = (isoDate: string): string => {
    const [year, month, day] = isoDate.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC"
    });
};

const offsetDate = (isoDate: string, days: number): string => {
    const [year, month, day] = isoDate.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day + days));
    return date.toISOString().split("T")[0];
};

const getTodayString = (): string => new Date().toISOString().split("T")[0];

export const ReportDateHeader = ({ currentDate, onDateChange, reportStatus }: ReportDateHeaderProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const currentPositionId = useAppSelector((state) => state.dailyReport.currentPositionId);
    const dateInputRef = useRef<HTMLInputElement>(null);
    const today = getTodayString();

    const handlePrev = () => onDateChange(offsetDate(currentDate, -1));
    const handleNext = () => onDateChange(offsetDate(currentDate, 1));

    const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            onDateChange(e.target.value);
        }
    };

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
                onClick={handlePrev}
                className={cn("min-h-[48px] min-w-[48px] md:min-h-9 md:min-w-9 text-white hover:bg-white/15 hover:text-white")}
                aria-label={t("dailyReports.dateHeader.prev")}
            >
                <ChevronLeft className="h-5 w-5" />
            </Button>

            <button
                type="button"
                onClick={openPicker}
                className="relative flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-white/15 transition-colors cursor-pointer"
                aria-label={t("dailyNotes.dateHeader.selectDate")}
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
                aria-label={t("dailyReports.dateHeader.next")}
                disabled={currentDate >= today}
            >
                <ChevronRight className="h-5 w-5" />
            </Button>
            </div>

            {/* Switcher row */}
            <div className="flex">
                <button
                    type="button"
                    onClick={() => { dispatch(setNoteCurrentDate(currentDate)); if (currentPositionId) dispatch(setNoteCurrentPosition(currentPositionId)); navigate(ROUTES.DAILY_NOTES); }}
                    className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-white/70 hover:bg-white/15 hover:text-white transition-colors"
                >
                    <StickyNote className="h-3.5 w-3.5" />
                    {t("navigation.notes")}
                </button>
                <button
                    type="button"
                    onClick={() => navigate(ROUTES.DAILY_REPORTS)}
                    className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 py-2.5 text-sm font-medium bg-white/20 text-white transition-colors"
                >
                    <BarChart2 className="h-3.5 w-3.5" />
                    {t("navigation.reports")}
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
