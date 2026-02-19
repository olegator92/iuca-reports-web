import { useId } from "react";
import { useTranslation } from "react-i18next";
import type { UseFormReturn } from "react-hook-form";

import { Button, FormField, Input, Loader } from "@/shared/ui";
import type { RoleFormData } from "../model/validation";

type RoleFormMode = "create" | "edit" | "view";

interface RoleFormProps {
    mode: RoleFormMode;
    form: UseFormReturn<RoleFormData, any>;
    isSubmitting: boolean;
    disableSubmit?: boolean;
    submitLabel?: string;
    isLoading?: boolean;
    isSystemRole?: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onCancel?: () => void;
    onModeChange?: (mode: "view" | "edit") => void;
    hideFooter?: boolean;
}

export const RoleForm = ({
    mode,
    form,
    isSubmitting,
    disableSubmit,
    submitLabel,
    isLoading,
    isSystemRole = false,
    onSubmit,
    onCancel,
    onModeChange,
    hideFooter,
}: RoleFormProps) => {
    const { t } = useTranslation();
    const nameInputId = useId();

    const isViewMode = mode === "view";
    const isCreateMode = mode === "create";
    const resolvedSubmitLabel =
        submitLabel ??
        (isCreateMode ? t("roleForm.createSubmit") : t("roleForm.updateSubmit"));
    const cancelLabel = isViewMode ? t("common.close") : t("roleForm.cancel");

    if (isLoading) {
        return <Loader className="py-8" label={t("common.loading")} />;
    }

    const nameError = form.formState.errors.name?.message;

    return (
        <form id="role-form" onSubmit={onSubmit} className="space-y-4">
            <FormField
                id={nameInputId}
                label={t("roleForm.nameLabel")}
                error={!isViewMode ? nameError : undefined}
            >
                <Input
                    id={nameInputId}
                    placeholder={t("roleForm.namePlaceholder")}
                    disabled={isViewMode}
                    aria-invalid={!isViewMode && Boolean(nameError)}
                    aria-describedby={!isViewMode && nameError ? `${nameInputId}-error` : undefined}
                    {...form.register("name")}
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
                        // Only show Edit button for non-system roles
                        onModeChange && !isSystemRole ? (
                            <Button type="button" onClick={() => onModeChange("edit")} className="min-h-[48px] md:min-h-0">
                                {t("roleForm.editMode")}
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

export type { RoleFormMode, RoleFormProps };
