import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { MessageSquarePlus, FileText, CalendarDays, ChevronRight } from "lucide-react";
import { useCurrentUser, getWorkWeekBounds } from "@/shared/lib";
import { useGetDailyNotesQuery } from "@/entities/daily-note";
import { useGetDailyReportByDateQuery } from "@/entities/daily-report";
import { useGetWeeklyReportsByRangeQuery } from "@/entities/weekly-report";
import { Badge, Skeleton } from "@/shared/ui";
import { ROUTES } from "@/shared/config";

const getTodayString = () => new Date().toISOString().split("T")[0];

const formatDate = (d: string) => {
    const [y, m, day] = d.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, day)).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
    });
};

export const DashboardPage = () => {
    const { t } = useTranslation();
    const user = useCurrentUser();

    const today = getTodayString();
    const { weekStart, weekEnd } = getWorkWeekBounds(new Date());

    const { data: notesData, isLoading: notesLoading } = useGetDailyNotesQuery({
        date: today,
        pageSize: 1,
    });
    const { data: dailyReports, isLoading: dailyLoading } =
        useGetDailyReportByDateQuery(today);
    const { data: weeklyReports, isLoading: weeklyLoading } =
        useGetWeeklyReportsByRangeQuery({ weekStart, weekEnd });

    const firstPositionId = user?.positions?.[0]?.id ?? null;
    const todayReport =
        dailyReports?.find((r) => !firstPositionId || r.positionId === firstPositionId) ??
        dailyReports?.[0] ??
        null;
    const weekReport =
        weeklyReports?.find((r) => !firstPositionId || r.positionId === firstPositionId) ??
        weeklyReports?.[0] ??
        null;
    const noteCount = notesData?.total ?? 0;

    return (
        <section className="mx-auto w-full max-w-xl px-2 py-6 sm:p-8">
            {/* Logo + project name */}
            <div className="mb-8 flex flex-col items-center gap-3">
                <svg
                    width="56"
                    height="56"
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-brand"
                >
                    <rect x="2" y="5" width="12" height="26" rx="4" className="fill-current opacity-30" />
                    <rect x="16" y="5" width="18" height="12" rx="4" className="fill-current" />
                    <rect x="16" y="19" width="12" height="12" rx="4" className="fill-current opacity-60" />
                </svg>
                <div className="text-center">
                    <p className="text-xl font-bold tracking-wide text-foreground">
                        {t("header.brand")}
                    </p>
                    {user && (
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            {t("dashboard.greeting", { name: user.name })}
                        </p>
                    )}
                </div>
            </div>

            {/* Navigation rows */}
            <div className="flex flex-col gap-3">
                {/* Add Note — brand row */}
                <Link
                    to={ROUTES.DAILY_REPORTS}
                    className="flex items-center gap-4 rounded-xl bg-brand px-5 py-4 text-white transition-opacity hover:opacity-90"
                >
                    <MessageSquarePlus className="h-6 w-6 shrink-0" />
                    <span className="flex-1 text-lg font-bold">
                        {t("dashboard.actions.addNote")}
                    </span>
                    {notesLoading ? (
                        <Skeleton className="h-6 w-8 bg-white/20" />
                    ) : (
                        <span className="rounded-full bg-white/20 px-3 py-0.5 text-sm font-semibold">
                            {noteCount}
                        </span>
                    )}
                    <ChevronRight className="h-5 w-5 shrink-0 opacity-60" />
                </Link>

                {/* Daily Report — row */}
                <Link
                    to={ROUTES.DAILY_REPORTS}
                    state={{ activeTab: "report" }}
                    className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 text-card-foreground transition-colors hover:bg-accent"
                >
                    <FileText className="h-6 w-6 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                        <p className="text-lg font-bold text-foreground">
                            {t("dashboard.cards.dailyReport")}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(today)}</p>
                    </div>
                    {dailyLoading ? (
                        <Skeleton className="h-6 w-20" />
                    ) : todayReport ? (
                        todayReport.status === "Submitted" ? (
                            <Badge className="border-transparent bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                {t("dailyReports.status.submitted")}
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="border-amber-300 text-amber-700 dark:text-amber-400">
                                {t("dailyReports.status.inProgress")}
                            </Badge>
                        )
                    ) : null}
                    <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                </Link>

                {/* Weekly Report — row */}
                <Link
                    to={ROUTES.WEEKLY_REPORTS}
                    className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 text-card-foreground transition-colors hover:bg-accent"
                >
                    <CalendarDays className="h-6 w-6 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                        <p className="text-lg font-bold text-foreground">
                            {t("dashboard.cards.weeklyReport")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {formatDate(weekStart)} – {formatDate(weekEnd)}
                        </p>
                    </div>
                    {weeklyLoading ? (
                        <Skeleton className="h-6 w-20" />
                    ) : weekReport ? (
                        weekReport.status === "Submitted" ? (
                            <Badge className="border-transparent bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                {t("weeklyReports.status.submitted")}
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="border-amber-300 text-amber-700 dark:text-amber-400">
                                {t("weeklyReports.status.inProgress")}
                            </Badge>
                        )
                    ) : null}
                    <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                </Link>
            </div>
        </section>
    );
};
