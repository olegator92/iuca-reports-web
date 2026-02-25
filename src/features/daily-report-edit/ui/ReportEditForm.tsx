import { useEffect, useId, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Textarea, FormField, Combobox } from "@/shared/ui";
import type { ComboboxOption } from "@/shared/ui";
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
    const statusSelectId = useId();
    const contentTextareaId = useId();

    const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<ReportEditFormData>({
        resolver: zodResolver(reportEditSchema),
        defaultValues: { content: initialContent, status: initialStatus }
    });

    useEffect(() => {
        reset({ content: initialContent, status: initialStatus });
    }, [initialContent, initialStatus, reset]);

    const content = watch("content") ?? "";
    const status = watch("status");
    const charCount = content.length;

    const statusOptions: ComboboxOption[] = useMemo(() => [
        { value: "InProgress", label: t("dailyReports.status.inProgress") },
        { value: "Generated", label: t("dailyReports.status.generated") },
    ], [t]);

    const handleFormSubmit = handleSubmit(async (data) => {
        await onSubmit(reportId, data.content, data.status as DailyReportStatus);
    });

    return (
        <form id={formId} onSubmit={handleFormSubmit} className="flex flex-col gap-3">
            <FormField
                id={statusSelectId}
                label={t("dailyReports.editDrawer.statusLabel")}
                error={!isReadOnly ? errors.status?.message : undefined}
            >
                <Combobox
                    value={status}
                    onChange={(value) => setValue("status", value as DailyReportStatus, { shouldValidate: true })}
                    options={statusOptions}
                    disabled={isReadOnly}
                    aria-label={t("dailyReports.editDrawer.statusLabel")}
                    aria-invalid={!isReadOnly && Boolean(errors.status)}
                    aria-describedby={!isReadOnly && errors.status ? `${statusSelectId}-error` : undefined}
                />
            </FormField>
            <FormField
                id={contentTextareaId}
                label={t("dailyReports.editDrawer.contentLabel")}
                error={!isReadOnly ? errors.content?.message : undefined}
            >
                <Textarea
                    id={contentTextareaId}
                    {...register("content")}
                    readOnly={isReadOnly}
                    rows={14}
                    className="resize-none font-mono text-sm"
                    placeholder={isReadOnly ? undefined : t("dailyReports.editDrawer.contentLabel")}
                    aria-invalid={!isReadOnly && Boolean(errors.content)}
                    aria-describedby={!isReadOnly && errors.content ? `${contentTextareaId}-error` : undefined}
                />
            </FormField>
            <p className="text-muted-foreground text-xs text-right">
                {charCount} / 20000
            </p>
        </form>
    );
};
