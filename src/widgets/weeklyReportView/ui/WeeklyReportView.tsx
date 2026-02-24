import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Pencil, Copy, Check } from "lucide-react";
import { Loader, ProtectedContent, Button } from "@/shared/ui";
import { PERMISSIONS } from "@/shared/lib";
import { GenerateWeeklyReportButton } from "@/features/weekly-report-generate";
import { RegenerateWeeklyReportButton } from "@/features/weekly-report-regenerate";
import { WeeklyReportEditDrawerForm, useWeeklyReportEditDrawer } from "@/features/weekly-report-edit";
import { useWeeklyReportView } from "../model/useWeeklyReportView";
import { WeekDateHeader } from "./WeekDateHeader";
import { PositionSelector } from "./PositionSelector";
import { WeeklyDailyReportsList } from "./WeeklyDailyReportsList";
import { WeeklyReportContent } from "./WeeklyReportContent";
import { WeeklyUnprocessedUpdatesBanner } from "./WeeklyUnprocessedUpdatesBanner";

type ActiveTab = "dailyReports" | "weeklyReport";

export const WeeklyReportView = () => {
    const { t } = useTranslation();
    const {
        currentWeekStart,
        currentWeekEnd,
        currentPositionId,
        positions,
        weeklyReport,
        dailyReports,
        isLoading,
        isError,
        handleWeekChange,
        handlePositionChange
    } = useWeeklyReportView();

    const { open, selectedReport, openDrawer, closeDrawer } = useWeeklyReportEditDrawer();
    const [activeTab, setActiveTab] = useState<ActiveTab>("weeklyReport");
    const [copied, setCopied] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleCopy = async () => {
        if (!contentRef.current) return;
        const html = contentRef.current.innerHTML;
        const plain = contentRef.current.innerText;
        await navigator.clipboard.write([
            new ClipboardItem({
                "text/html": new Blob([html], { type: "text/html" }),
                "text/plain": new Blob([plain], { type: "text/plain" }),
            }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col h-full">
            <WeekDateHeader
                currentWeekStart={currentWeekStart}
                currentWeekEnd={currentWeekEnd}
                onWeekChange={handleWeekChange}
                reportStatus={weeklyReport?.status ?? null}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            <PositionSelector
                positions={positions}
                currentPositionId={currentPositionId}
                onPositionChange={handlePositionChange}
            />

            {/* Scrollable content area */}
            <div className="custom-scrollbar flex flex-col flex-1 gap-4 p-4 overflow-y-auto bg-brand/5">
                {isLoading && (
                    <div className="flex justify-center py-8">
                        <Loader />
                    </div>
                )}

                {isError && (
                    <p className="text-destructive text-sm text-center py-8">
                        {t("errors.somethingWentWrong")}
                    </p>
                )}

                {!isLoading && !isError && activeTab === "dailyReports" && (
                    <WeeklyDailyReportsList dailyReports={dailyReports} />
                )}

                {!isLoading && !isError && activeTab === "weeklyReport" && (
                    <>
                        {weeklyReport?.status === "Generated" && weeklyReport.hasUnprocessedUpdates && (
                            <WeeklyUnprocessedUpdatesBanner />
                        )}
                        <WeeklyReportContent
                            content={weeklyReport?.content ?? null}
                            hasReport={!!weeklyReport}
                            contentRef={contentRef}
                        />
                    </>
                )}
            </div>

            {/* Fixed footer — action bar (only on weekly report tab) */}
            {!isLoading && !isError && currentPositionId && activeTab === "weeklyReport" && (
                <div className="flex flex-shrink-0 items-center justify-end gap-3 border-t px-4 pt-3 pb-8">
                    {(!weeklyReport || weeklyReport.status === "InProgress") && (
                        <GenerateWeeklyReportButton
                            weekStart={currentWeekStart}
                            weekEnd={currentWeekEnd}
                            positionId={weeklyReport?.positionId ?? currentPositionId}
                        />
                    )}
                    {weeklyReport?.status === "Generated" && (
                        <RegenerateWeeklyReportButton reportId={weeklyReport.id} />
                    )}
                    {weeklyReport && (
                        <>
                            <ProtectedContent requiredPermissions={[PERMISSIONS.WEEKLY_REPORT_EDIT]}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openDrawer(weeklyReport)}
                                    className="min-h-[48px] md:min-h-0 px-4"
                                >
                                    <Pencil className="h-4 w-4" />
                                    <span className="ml-1.5 hidden sm:inline">{t("weeklyReports.actions.edit")}</span>
                                </Button>
                            </ProtectedContent>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCopy}
                                className="min-h-[48px] md:min-h-0 px-4 text-muted-foreground hover:text-foreground"
                            >
                                {copied
                                    ? <Check className="h-3.5 w-3.5 text-green-500" />
                                    : <Copy className="h-3.5 w-3.5" />
                                }
                                <span className="ml-1.5 hidden sm:inline">
                                    {copied ? t("weeklyReports.actions.copied") : t("weeklyReports.actions.copy")}
                                </span>
                            </Button>
                        </>
                    )}
                </div>
            )}

            <WeeklyReportEditDrawerForm
                open={open}
                onClose={closeDrawer}
                report={selectedReport}
                mode="edit"
            />
        </div>
    );
};
