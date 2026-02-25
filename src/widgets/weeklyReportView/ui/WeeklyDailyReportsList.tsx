import { useTranslation } from "react-i18next";
import { StickyNote } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { DailyReport } from "@/entities/daily-report";

interface WeeklyDailyReportsListProps {
    dailyReports: DailyReport[];
}

const formatReportDate = (isoDate: string): string => {
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

export const WeeklyDailyReportsList = ({ dailyReports }: WeeklyDailyReportsListProps) => {
    const { t } = useTranslation();

    if (dailyReports.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <StickyNote className="h-12 w-12 text-muted-foreground/40" />
                <p className="text-muted-foreground text-sm max-w-xs">
                    {t("weeklyReports.noDailyReports")}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {dailyReports.map((report) => (
                <div
                    key={report.id}
                    className="rounded-lg border border-border bg-card px-4 py-3"
                >
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                        {formatReportDate(report.reportDate)}
                    </p>
                    {report.content ? (
                        <div className="text-sm leading-relaxed">
                            <ReactMarkdown
                                components={{
                                    h1: ({ children }) => <h1 className="text-base font-bold mb-1">{children}</h1>,
                                    h2: ({ children }) => <h2 className="text-sm font-semibold mb-1">{children}</h2>,
                                    h3: ({ children }) => <h3 className="text-sm font-semibold mb-1">{children}</h3>,
                                    p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                                    ul: ({ children }) => <ul className="my-1 ml-4 list-disc space-y-0.5">{children}</ul>,
                                    ol: ({ children }) => <ol className="my-1 ml-4 list-decimal space-y-0.5">{children}</ol>,
                                    li: ({ children }) => <li className="leading-snug">{children}</li>,
                                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                    em: ({ children }) => <em className="italic">{children}</em>,
                                }}
                            >
                                {report.content}
                            </ReactMarkdown>
                        </div>
                    ) : (
                        <p className="text-xs text-muted-foreground italic">{t("weeklyReports.noDailyReports")}</p>
                    )}
                </div>
            ))}
        </div>
    );
};
