import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Textarea, Label, Select } from "@/shared/ui";
import type { DailyReportStatus } from "@/entities/daily-report";
import { reportEditSchema, type ReportEditFormData } from "../model/validation";

interface ReportEditFormProps {
    reportId: string;
    initialContent: string;
    initialStatus: DailyReportStatus;
    mode: "edit" | "view";
    onSubmit: (id: string, content: string, status: DailyReportStatus) => Promise<void>;
    formId?: string;
}

export const ReportEditForm = ({
    reportId,
    initialContent,
    initialStatus,
    mode,
    onSubmit,
    formId = "report-edit-form"
}: ReportEditFormProps) => {
    const { t } = useTranslation();
    const isReadOnly = mode === "view";

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<ReportEditFormData>({
        resolver: zodResolver(reportEditSchema),
        defaultValues: { content: initialContent, status: initialStatus }
    });

    useEffect(() => {
        reset({ content: initialContent, status: initialStatus });
    }, [initialContent, initialStatus, reset]);

    const content = watch("content") ?? "";
    const charCount = content.length;

    const handleFormSubmit = handleSubmit(async (data) => {
        await onSubmit(reportId, data.content, data.status as DailyReportStatus);
    });

    return (
        <form id={formId} onSubmit={handleFormSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
                <Label htmlFor="report-status">
                    {t("dailyReports.editDrawer.statusLabel")}
                </Label>
                <Select
                    id="report-status"
                    {...register("status")}
                    disabled={isReadOnly}
                >
                    <option value="InProgress">{t("dailyReports.status.inProgress")}</option>
                    <option value="Generated">{t("dailyReports.status.generated")}</option>
                </Select>
                {errors.status && (
                    <p className="text-destructive text-xs">{errors.status.message}</p>
                )}
            </div>
            <div className="flex flex-col gap-1.5">
                <Label htmlFor="report-content">
                    {t("dailyReports.editDrawer.contentLabel")}
                </Label>
                <Textarea
                    id="report-content"
                    {...register("content")}
                    readOnly={isReadOnly}
                    rows={14}
                    className="resize-none font-mono text-sm"
                    placeholder={isReadOnly ? undefined : t("dailyReports.editDrawer.contentLabel")}
                />
                {errors.content && (
                    <p className="text-destructive text-xs">{errors.content.message}</p>
                )}
            </div>
            <p className="text-muted-foreground text-xs text-right">
                {charCount} / 20000
            </p>
        </form>
    );
};
