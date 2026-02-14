import { useId } from "react";
import { useTranslation } from "react-i18next";
import type { UseFormReturn } from "react-hook-form";

import { Button, FormField, Input, Loader, Textarea } from "@/shared/ui";
import type { TemplateFormData } from "../model/validation";

type TemplateFormMode = "create" | "edit" | "view";

interface TemplateFormProps {
    mode: TemplateFormMode;
    form: UseFormReturn<TemplateFormData, any>;
    isSubmitting: boolean;
    disableSubmit?: boolean;
    submitLabel?: string;
    isLoading?: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onCancel?: () => void;
    onModeChange?: (mode: "view" | "edit") => void;
    hideFooter?: boolean;
}

export const TemplateForm = ({
    mode,
    form,
    isSubmitting,
    disableSubmit,
    submitLabel,
    isLoading,
    onSubmit,
    onCancel,
    onModeChange,
    hideFooter,
}: TemplateFormProps) => {
    const { t } = useTranslation();
    const nameInputId = useId();
    const descriptionInputId = useId();

    const isViewMode = mode === "view";
    const isCreateMode = mode === "create";
    const resolvedSubmitLabel =
        submitLabel ??
        (isCreateMode ? t("templateForm.createSubmit") : t("templateForm.updateSubmit"));
    const cancelLabel = isViewMode ? t("common.close") : t("templateForm.cancel");

    if (isLoading) {
        return <Loader className="py-8" label={t("common.loading")} />;
    }

    const nameError = form.formState.errors.name?.message;
    const descriptionError = form.formState.errors.description?.message;

    return (
        <form id="template-form" onSubmit={onSubmit} className="space-y-4">
            <FormField
                id={nameInputId}
                label={t("templateForm.nameLabel")}
                error={!isViewMode ? nameError : undefined}
            >
                <Input
                    id={nameInputId}
                    placeholder={t("templateForm.namePlaceholder")}
                    disabled={isViewMode}
                    aria-invalid={!isViewMode && Boolean(nameError)}
                    aria-describedby={!isViewMode && nameError ? `${nameInputId}-error` : undefined}
                    {...form.register("name")}
                />
            </FormField>
            <FormField
                id={descriptionInputId}
                label={t("templateForm.descriptionLabel")}
                optional
                optionalHint={t("templateForm.optionalHint")}
                error={!isViewMode ? descriptionError : undefined}
            >
                <Textarea
                    id={descriptionInputId}
                    placeholder={t("templateForm.descriptionPlaceholder")}
                    rows={isViewMode ? 6 : 5}
                    disabled={isViewMode}
                    {...form.register("description")}
                />
            </FormField>
            {!hideFooter && (
                <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
                    {onCancel ? (
                        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} className="min-h-[48px] md:min-h-0">
                            {cancelLabel}
                        </Button>
                    ) : null}
                    {isViewMode ? (
                        onModeChange ? (
                            <Button type="button" onClick={() => onModeChange("edit")} className="min-h-[48px] md:min-h-0">
                                {t("templateForm.editMode")}
                            </Button>
                        ) : null
                    ) : (
                        <Button type="submit" isLoading={isSubmitting} disabled={disableSubmit} className="min-h-[48px] md:min-h-0">
                            {resolvedSubmitLabel}
                        </Button>
                    )}
                </div>
            )}
        </form>
    );
};

export type { TemplateFormMode, TemplateFormProps };
