import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Pencil, Copy, Check, FilePlus, MoreVertical, Loader2, SlidersHorizontal } from "lucide-react";
import { Loader, Button, DropdownMenu, DropdownMenuItem } from "@/shared/ui";
import { PERMISSIONS, useHasPermission } from "@/shared/lib";
import { GenerateWeeklyReportButton } from "@/features/weekly-report-generate";
import { useWeeklyReportCreate } from "@/features/weekly-report-create";
import { SubmitWeeklyReportButton } from "@/features/weekly-report-submit";
import { ReturnWeeklyReportButton } from "@/features/weekly-report-return";
import { WeeklyReportEditDrawerForm, useWeeklyReportEditDrawer } from "@/features/weekly-report-edit";
import { useWeeklyReportView } from "../model/useWeeklyReportView";
import { WeekDateHeader } from "./WeekDateHeader";
import { PositionSelector } from "./PositionSelector";
import { WeeklyDailyReportsList } from "./WeeklyDailyReportsList";
import { WeeklyReportContent } from "./WeeklyReportContent";
import { WeeklyUnprocessedUpdatesBanner } from "./WeeklyUnprocessedUpdatesBanner";
import { WeeklyReportSettingsDrawer } from "./WeeklyReportSettingsDrawer";

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
    const { handleCreate, isLoading: isCreating } = useWeeklyReportCreate();
    const canEdit = useHasPermission(PERMISSIONS.WEEKLY_REPORT_EDIT);

    const [activeTab, setActiveTab] = useState<ActiveTab>("weeklyReport");
    const [copied, setCopied] = useState(false);
    const [detailLevel, setDetailLevel] = useState(5);
    const [settingsOpen, setSettingsOpen] = useState(false);
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

    const hasContent = !!weeklyReport?.content;

    // Show actions dropdown when user can edit (Create/Edit items) or content exists (Copy)
    const showActionsDropdown = canEdit || hasContent;

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
                        {weeklyReport?.status === "InProgress" && weeklyReport.hasUnprocessedUpdates && (
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
                <div className="flex flex-shrink-0 items-center justify-end gap-3 border-t px-4 pt-3 pb-8 md:py-4">
                    {/* Primary actions */}
                    {!weeklyReport && (
                        <GenerateWeeklyReportButton
                            weekStart={currentWeekStart}
                            weekEnd={currentWeekEnd}
                            positionId={currentPositionId}
                            hasReport={false}
                            detailLevel={detailLevel}
                        />
                    )}
                    {weeklyReport?.status === "InProgress" && (
                        <>
                            <GenerateWeeklyReportButton
                                weekStart={currentWeekStart}
                                weekEnd={currentWeekEnd}
                                positionId={weeklyReport.positionId}
                                hasReport={true}
                                reportId={weeklyReport.id}
                                detailLevel={detailLevel}
                            />
                            <SubmitWeeklyReportButton reportId={weeklyReport.id} />
                        </>
                    )}
                    {weeklyReport?.status === "Submitted" && (
                        <ReturnWeeklyReportButton reportId={weeklyReport.id} />
                    )}

                    {/* Actions dropdown */}
                    {showActionsDropdown && (
                        <DropdownMenu
                            trigger={
                                <Button size="icon" variant="outline" className="min-h-[48px] min-w-[48px] md:min-h-0 md:min-w-0">
                                    <MoreVertical className="h-5 w-5" strokeWidth={2.5} />
                                </Button>
                            }
                            align="end"
                            placement="top"
                        >
                            {canEdit && (
                                <DropdownMenuItem
                                    icon={<SlidersHorizontal />}
                                    onClick={() => setSettingsOpen(true)}
                                >
                                    {t("weeklyReports.actions.settings")}
                                </DropdownMenuItem>
                            )}
                            {!weeklyReport && canEdit && (
                                <DropdownMenuItem
                                    icon={isCreating ? <Loader2 className="animate-spin" /> : <FilePlus />}
                                    onClick={async () => {
                                if (!currentPositionId) return;
                                const report = await handleCreate({ weekStart: currentWeekStart, weekEnd: currentWeekEnd, positionId: currentPositionId });
                                if (report) openDrawer(report);
                            }}
                                    disabled={isCreating}
                                >
                                    {t("weeklyReports.actions.create")}
                                </DropdownMenuItem>
                            )}
                            {weeklyReport?.status === "InProgress" && canEdit && (
                                <DropdownMenuItem
                                    icon={<Pencil />}
                                    onClick={() => openDrawer(weeklyReport)}
                                >
                                    {t("weeklyReports.actions.edit")}
                                </DropdownMenuItem>
                            )}
                            {hasContent && (
                                <DropdownMenuItem
                                    icon={copied ? <Check className="text-green-500" /> : <Copy />}
                                    onClick={handleCopy}
                                >
                                    {copied ? t("weeklyReports.actions.copied") : t("weeklyReports.actions.copy")}
                                </DropdownMenuItem>
                            )}
                        </DropdownMenu>
                    )}
                </div>
            )}

            <WeeklyReportEditDrawerForm
                open={open}
                onClose={closeDrawer}
                report={selectedReport}
                mode="edit"
            />

            <WeeklyReportSettingsDrawer
                open={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                detailLevel={detailLevel}
                onChange={setDetailLevel}
            />
        </div>
    );
};
