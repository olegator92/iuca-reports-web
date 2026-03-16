import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { MessageSquarePlus, FileText, CalendarDays, Users, Building2, Briefcase, BarChart3, ChevronRight } from "lucide-react";
import { useCurrentUser, getWorkWeekBounds, useIsAdmin, useHasPermission, PERMISSIONS } from "@/shared/lib";
import { useGetDailyNotesQuery } from "@/entities/daily-note";
import { useGetDailyReportByDateQuery } from "@/entities/daily-report";
import { useGetWeeklyReportsByRangeQuery } from "@/entities/weekly-report";
import { useGetUsersQuery } from "@/entities/user/api";
import { useGetDepartmentsQuery } from "@/entities/department";
import { useGetPositionsQuery } from "@/entities/position";
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
    const isAdminRole = useIsAdmin();
    // Also detect admin by wildcard permission ("*") in case role name differs
    const hasWildcard = user?.permissions?.includes(PERMISSIONS.ALL) ?? false;
    const isEffectiveAdmin = isAdminRole || hasWildcard;

    const hasDailyReportView = useHasPermission(PERMISSIONS.DAILY_REPORT_VIEW);
    const hasMenuManagement = useHasPermission(PERMISSIONS.MENU_MANAGEMENT);
    const hasSupervisorReportView = useHasPermission(PERMISSIONS.SUPERVISOR_REPORT_VIEW);

    // Each section is shown independently based on the relevant permission.
    // Multiple roles = multiple sections visible.
    const showUserSection = isEffectiveAdmin || hasDailyReportView;
    const showManagerSection = isEffectiveAdmin || hasMenuManagement;
    const showSupervisorSection = isEffectiveAdmin || hasSupervisorReportView;

    const today = getTodayString();
    const { weekStart, weekEnd } = getWorkWeekBounds(new Date());

    // Employee section data
    const { data: notesData, isLoading: notesLoading } = useGetDailyNotesQuery(
        { date: today, pageSize: 1 },
        { skip: !showUserSection }
    );
    const { data: dailyReports, isLoading: dailyLoading } =
        useGetDailyReportByDateQuery(today, { skip: !showUserSection });
    const { data: weeklyReports, isLoading: weeklyLoading } =
        useGetWeeklyReportsByRangeQuery({ weekStart, weekEnd }, { skip: !showUserSection });

    // Manager section data
    const { data: usersData, isLoading: usersLoading } = useGetUsersQuery(
        { page: 1, pageSize: 1 },
        { skip: !showManagerSection }
    );
    const { data: depsData, isLoading: depsLoading } = useGetDepartmentsQuery(
        { page: 1, pageSize: 1 },
        { skip: !showManagerSection }
    );
    const { data: posData, isLoading: posLoading } = useGetPositionsQuery(
        { page: 1, pageSize: 1 },
        { skip: !showManagerSection }
    );

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
            <div className="flex flex-col gap-3">
                {/* ── Employee section ── */}
                {showUserSection && (
                    <>
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
                    </>
                )}

                {/* ── Manager section ── */}
                {showManagerSection && (
                    <>
                        <Link
                            to={ROUTES.USERS}
                            className="flex items-center gap-4 rounded-xl bg-brand px-5 py-4 text-white transition-opacity hover:opacity-90"
                        >
                            <Users className="h-6 w-6 shrink-0" />
                            <span className="flex-1 text-lg font-bold">
                                {t("navigation.users")}
                            </span>
                            {usersLoading ? (
                                <Skeleton className="h-6 w-8 bg-white/20" />
                            ) : (
                                <span className="rounded-full bg-white/20 px-3 py-0.5 text-sm font-semibold">
                                    {usersData?.totalCount ?? 0}
                                </span>
                            )}
                            <ChevronRight className="h-5 w-5 shrink-0 opacity-60" />
                        </Link>

                        <Link
                            to={ROUTES.DEPARTMENTS}
                            className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 text-card-foreground transition-colors hover:bg-accent"
                        >
                            <Building2 className="h-6 w-6 shrink-0 text-muted-foreground" />
                            <span className="flex-1 text-lg font-bold text-foreground">
                                {t("navigation.departments")}
                            </span>
                            {depsLoading ? (
                                <Skeleton className="h-6 w-8" />
                            ) : (
                                <span className="rounded-full bg-muted px-3 py-0.5 text-sm font-semibold text-muted-foreground">
                                    {depsData?.total ?? 0}
                                </span>
                            )}
                            <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                        </Link>

                        <Link
                            to={ROUTES.POSITIONS}
                            className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 text-card-foreground transition-colors hover:bg-accent"
                        >
                            <Briefcase className="h-6 w-6 shrink-0 text-muted-foreground" />
                            <span className="flex-1 text-lg font-bold text-foreground">
                                {t("navigation.positions")}
                            </span>
                            {posLoading ? (
                                <Skeleton className="h-6 w-8" />
                            ) : (
                                <span className="rounded-full bg-muted px-3 py-0.5 text-sm font-semibold text-muted-foreground">
                                    {posData?.total ?? 0}
                                </span>
                            )}
                            <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                        </Link>
                    </>
                )}

                {/* ── Supervisor section ── */}
                {showSupervisorSection && (
                    <Link
                        to={ROUTES.SUPERVISOR_REPORTS}
                        className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 text-card-foreground transition-colors hover:bg-accent"
                    >
                        <BarChart3 className="h-6 w-6 shrink-0 text-muted-foreground" />
                        <span className="flex-1 text-lg font-bold text-foreground">
                            {t("navigation.supervisorReports")}
                        </span>
                        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                    </Link>
                )}
            </div>
        </section>
    );
};
