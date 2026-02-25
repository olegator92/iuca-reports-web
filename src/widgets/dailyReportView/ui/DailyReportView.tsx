import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Pencil, Copy, Check } from "lucide-react";
import { Loader, ProtectedContent, Button } from "@/shared/ui";
import { PERMISSIONS } from "@/shared/lib";
import { GenerateReportButton } from "@/features/daily-report-generate";
import { RegenerateReportButton } from "@/features/daily-report-regenerate";
import { ReportEditDrawerForm, useReportEditDrawer } from "@/features/daily-report-edit";
import { useDailyReportView } from "../model/useDailyReportView";
import { ReportDateHeader } from "./ReportDateHeader";
import { PositionSelector } from "./PositionSelector";
import { UnprocessedUpdatesBanner } from "./UnprocessedUpdatesBanner";
import { ReportContent } from "./ReportContent";

export const DailyReportView = () => {
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

                {report?.status === "Generated" && report.hasUnprocessedUpdates && (
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
                <div className="flex flex-shrink-0 items-center justify-end gap-3 border-t px-4 pt-3 pb-8">
                    {(!report || report.status === "InProgress") && (
                        <GenerateReportButton date={currentDate} positionId={report?.positionId ?? currentPositionId} />
                    )}
                    {report?.status === "Generated" && (
                        <RegenerateReportButton reportId={report.id} />
                    )}
                    {report && (
                        <>
                            <ProtectedContent requiredPermissions={[PERMISSIONS.DAILY_REPORT_EDIT]}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openDrawer(report)}
                                    className="min-h-[48px] md:min-h-0 px-4"
                                >
                                    <Pencil className="h-4 w-4" />
                                    <span className="ml-1.5 hidden sm:inline">{t("dailyReports.actions.edit")}</span>
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
                                    {copied ? t("dailyReports.actions.copied") : t("dailyReports.actions.copy")}
                                </span>
                            </Button>
                        </>
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
