import { useEffect, useId, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Textarea, FormField, Combobox } from "@/shared/ui";
import type { ComboboxOption } from "@/shared/ui";
import type { WeeklyReportStatus } from "@/entities/weekly-report";
import { weeklyReportEditSchema, type WeeklyReportEditFormData } from "../model/validation";

interface WeeklyReportEditFormProps {
    reportId: string;
    initialContent: string;
    initialStatus: WeeklyReportStatus;
    mode: "edit" | "view";
    onSubmit: (id: string, content: string, status: WeeklyReportStatus) => Promise<void>;
    formId?: string;
}

export const WeeklyReportEditForm = ({
    reportId,
    initialContent,
    initialStatus,
    mode,
    onSubmit,
    formId = "weekly-report-edit-form"
}: WeeklyReportEditFormProps) => {
    const { t } = useTranslation();
    const isReadOnly = mode === "view";
    const statusSelectId = useId();
    const contentTextareaId = useId();

    const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<WeeklyReportEditFormData>({
        resolver: zodResolver(weeklyReportEditSchema),
        defaultValues: { content: initialContent, status: initialStatus }
    });

    useEffect(() => {
        reset({ content: initialContent, status: initialStatus });
    }, [initialContent, initialStatus, reset]);

    const content = watch("content") ?? "";
    const status = watch("status");
    const charCount = content.length;

    const statusOptions: ComboboxOption[] = useMemo(() => [
        { value: "InProgress", label: t("weeklyReports.status.inProgress") },
        { value: "Generated", label: t("weeklyReports.status.generated") },
    ], [t]);

    const handleFormSubmit = handleSubmit(async (data) => {
        await onSubmit(reportId, data.content, data.status as WeeklyReportStatus);
    });

    return (
        <form id={formId} onSubmit={handleFormSubmit} className="flex flex-col gap-3">
            <FormField
                id={statusSelectId}
                label={t("weeklyReports.editDrawer.statusLabel")}
                error={!isReadOnly ? errors.status?.message : undefined}
            >
                <Combobox
                    value={status}
                    onChange={(value) => setValue("status", value as WeeklyReportStatus, { shouldValidate: true })}
                    options={statusOptions}
                    disabled={isReadOnly}
                    aria-label={t("weeklyReports.editDrawer.statusLabel")}
                    aria-invalid={!isReadOnly && Boolean(errors.status)}
                    aria-describedby={!isReadOnly && errors.status ? `${statusSelectId}-error` : undefined}
                />
            </FormField>
            <FormField
                id={contentTextareaId}
                label={t("weeklyReports.editDrawer.contentLabel")}
                error={!isReadOnly ? errors.content?.message : undefined}
            >
                <Textarea
                    id={contentTextareaId}
                    {...register("content")}
                    readOnly={isReadOnly}
                    rows={16}
                    className="resize-none font-mono text-sm"
                    placeholder={isReadOnly ? undefined : t("weeklyReports.editDrawer.contentLabel")}
                    aria-invalid={!isReadOnly && Boolean(errors.content)}
                    aria-describedby={!isReadOnly && errors.content ? `${contentTextareaId}-error` : undefined}
                />
            </FormField>
            <p className="text-muted-foreground text-xs text-right">
                {charCount} / 50000
            </p>
        </form>
    );
};
