import { useEffect, useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Textarea, FormField } from "@/shared/ui";
import { weeklyReportEditSchema, type WeeklyReportEditFormData } from "../model/validation";

interface WeeklyReportEditFormProps {
    reportId: string;
    initialContent: string;
    mode: "edit" | "view";
    onSubmit: (id: string, content: string) => Promise<void>;
    formId?: string;
}

export const WeeklyReportEditForm = ({
    reportId,
    initialContent,
    mode,
    onSubmit,
    formId = "weekly-report-edit-form"
}: WeeklyReportEditFormProps) => {
    const { t } = useTranslation();
    const isReadOnly = mode === "view";
    const contentTextareaId = useId();

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<WeeklyReportEditFormData>({
        resolver: zodResolver(weeklyReportEditSchema),
        defaultValues: { content: initialContent }
    });

    useEffect(() => {
        reset({ content: initialContent });
    }, [initialContent, reset]);

    const content = watch("content") ?? "";
    const charCount = content.length;

    const handleFormSubmit = handleSubmit(async (data) => {
        await onSubmit(reportId, data.content);
    });

    return (
        <form id={formId} onSubmit={handleFormSubmit} className="flex flex-col gap-3">
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
