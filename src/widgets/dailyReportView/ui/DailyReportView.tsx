import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Pencil, Copy, Check, FilePlus, MoreVertical, Loader2 } from "lucide-react";
import { Loader, Button, DropdownMenu, DropdownMenuItem } from "@/shared/ui";
import { PERMISSIONS, useHasPermission } from "@/shared/lib";
import { GenerateReportButton } from "@/features/daily-report-generate";
import { useDailyReportCreate } from "@/features/daily-report-create";
import { SubmitReportButton } from "@/features/daily-report-submit";
import { ReturnReportButton } from "@/features/daily-report-return";
import { ReportEditDrawerForm, useReportEditDrawer } from "@/features/daily-report-edit";
import { useDailyReportView } from "../model/useDailyReportView";
import { ReportDateHeader } from "./ReportDateHeader";
import { PositionSelector } from "./PositionSelector";
import { UnprocessedUpdatesBanner } from "./UnprocessedUpdatesBanner";
import { ReportContent } from "./ReportContent";

interface DailyReportViewProps {
    externalControls?: boolean;
}

export const DailyReportView = ({ externalControls = false }: DailyReportViewProps) => {
    const { t } = useTranslation();
    const {
        currentDate,
        currentPositionId,
        positions,
        report,
        isLoading,
        isError,
        handleDateChange,
        handlePositionChange
    } = useDailyReportView();
    const { open, selectedReport, openDrawer, closeDrawer } = useReportEditDrawer();
    const { handleCreate, isLoading: isCreating } = useDailyReportCreate();
    const canEdit = useHasPermission(PERMISSIONS.DAILY_REPORT_EDIT);

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

    const hasContent = report?.content !== undefined && report?.content !== null;

    // Show actions dropdown when user can edit (Create/Edit items) or content exists (Copy)
    const showActionsDropdown = canEdit || hasContent;

    return (
        <div className="flex flex-col h-full">
            {!externalControls && (
                <>
                    <ReportDateHeader
                        currentDate={currentDate}
                        onDateChange={handleDateChange}
                        reportStatus={report?.status ?? null}
                    />

                    <PositionSelector
                        positions={positions}
                        currentPositionId={currentPositionId}
                        onPositionChange={handlePositionChange}
                    />
                </>
            )}

            {/* Scrollable content */}
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

                {report?.status === "InProgress" && report.hasUnprocessedUpdates && (
                    <UnprocessedUpdatesBanner />
                )}

                {!isLoading && !isError && (
                    <ReportContent
                        content={report?.content ?? null}
                        hasReport={!!report}
                        contentRef={contentRef}
                    />
                )}
            </div>

            {/* Fixed footer — action bar */}
            {!isLoading && !isError && currentPositionId && (
                <div className="flex flex-shrink-0 items-center justify-end gap-3 border-t px-4 pt-3 pb-8 md:py-4">
                    {/* Primary actions */}
                    {!report && (
                        <GenerateReportButton
                            date={currentDate}
                            positionId={currentPositionId}
                            hasReport={false}
                        />
                    )}
                    {report?.status === "InProgress" && (
                        <>
                            <GenerateReportButton
                                date={currentDate}
                                positionId={report.positionId}
                                hasReport={true}
                                reportId={report.id}
                            />
                            <SubmitReportButton reportId={report.id} />
                        </>
                    )}
                    {report?.status === "Submitted" && (
                        <ReturnReportButton reportId={report.id} />
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
                            {!report && canEdit && (
                                <DropdownMenuItem
                                    icon={isCreating ? <Loader2 className="animate-spin" /> : <FilePlus />}
                                    onClick={async () => {
                                const report = await handleCreate({ date: currentDate, positionId: currentPositionId });
                                if (report) openDrawer(report);
                            }}
                                    disabled={isCreating}
                                >
                                    {t("dailyReports.actions.create")}
                                </DropdownMenuItem>
                            )}
                            {report?.status === "InProgress" && canEdit && (
                                <DropdownMenuItem
                                    icon={<Pencil />}
                                    onClick={() => openDrawer(report)}
                                >
                                    {t("dailyReports.actions.edit")}
                                </DropdownMenuItem>
                            )}
                            {hasContent && (
                                <DropdownMenuItem
                                    icon={copied ? <Check className="text-green-500" /> : <Copy />}
                                    onClick={handleCopy}
                                >
                                    {copied ? t("dailyReports.actions.copied") : t("dailyReports.actions.copy")}
                                </DropdownMenuItem>
                            )}
                        </DropdownMenu>
                    )}
                </div>
            )}

            <ReportEditDrawerForm
                open={open}
                onClose={closeDrawer}
                report={selectedReport}
                mode="edit"
            />
        </div>
    );
};
