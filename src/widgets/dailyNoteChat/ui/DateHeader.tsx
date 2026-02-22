import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib";

interface DateHeaderProps {
    currentDate: string;
    onDateChange: (date: string) => void;
}

const formatDate = (isoDate: string): string => {
    const [year, month, day] = isoDate.split("-").map(Number);
    // Use UTC to avoid timezone shifts
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

export const DateHeader = ({ currentDate, onDateChange }: DateHeaderProps) => {
    const { t } = useTranslation();
    const dateInputRef = useRef<HTMLInputElement>(null);
    const today = getTodayString();
    const isToday = currentDate === today;

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
        <div className="flex items-center justify-between bg-brand px-3 py-2 sm:px-4">
            <Button
                variant="ghost"
                size="icon"
                onClick={handlePrev}
                className={cn("min-h-[48px] min-w-[48px] md:min-h-9 md:min-w-9 text-white hover:bg-white/15 hover:text-white")}
                aria-label={t("dailyNotes.dateHeader.previousDay")}
            >
                <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex flex-col items-center gap-1">
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
                {isToday && (
                    <span className="text-xs text-white/70">
                        {t("dailyNotes.dateHeader.today")}
                    </span>
                )}
            </div>

            <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className={cn("min-h-[48px] min-w-[48px] md:min-h-9 md:min-w-9 text-white hover:bg-white/15 hover:text-white disabled:text-white/40")}
                aria-label={t("dailyNotes.dateHeader.nextDay")}
                disabled={isToday}
            >
                <ChevronRight className="h-5 w-5" />
            </Button>
        </div>
    );
};
