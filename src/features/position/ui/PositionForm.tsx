import { useId } from "react";
import { useTranslation } from "react-i18next";
import type { UseFormReturn } from "react-hook-form";

import { Button, FormField, Input, Loader, Select } from "@/shared/ui";
import { useGetAllDepartmentsQuery } from "@/entities/department";
import type { PositionFormData } from "../model/validation";

type PositionFormMode = "create" | "edit" | "view";

interface PositionFormProps {
    mode: PositionFormMode;
    form: UseFormReturn<PositionFormData, unknown>;
    isSubmitting: boolean;
    disableSubmit?: boolean;
    submitLabel?: string;
    isLoading?: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onCancel?: () => void;
    onModeChange?: (mode: "view" | "edit") => void;
    hideFooter?: boolean;
}

export const PositionForm = ({
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
}: PositionFormProps) => {
    const { t } = useTranslation();
    const nameInputId = useId();
    const departmentSelectId = useId();

    const { data: departments = [], isLoading: isDepartmentsLoading } = useGetAllDepartmentsQuery();

    const isViewMode = mode === "view";
    const isCreateMode = mode === "create";
    const resolvedSubmitLabel =
        submitLabel ??
        (isCreateMode ? t("positions.createSubmit") : t("positions.updateSubmit"));
    const cancelLabel = isViewMode ? t("common.close") : t("positions.cancel");

    if (isLoading) {
        return <Loader className="py-8" label={t("common.loading")} />;
    }

    const nameError = form.formState.errors.name?.message;
    const departmentError = form.formState.errors.departmentId?.message;

    // Filter out deleted departments
    const activeDepartments = departments.filter(dept => !dept.isDeleted);

    return (
        <form id="position-form" onSubmit={onSubmit} className="space-y-4">
            <FormField
                id={nameInputId}
                label={t("positions.nameLabel")}
                error={!isViewMode ? nameError : undefined}
            >
                <Input
                    id={nameInputId}
                    placeholder={t("positions.namePlaceholder")}
                    disabled={isViewMode}
                    aria-invalid={!isViewMode && Boolean(nameError)}
                    aria-describedby={!isViewMode && nameError ? `${nameInputId}-error` : undefined}
                    {...form.register("name")}
                />
            </FormField>
            <FormField
                id={departmentSelectId}
                label={t("positions.departmentLabel")}
                error={!isViewMode ? departmentError : undefined}
            >
                <Select
                    id={departmentSelectId}
                    disabled={isViewMode || isDepartmentsLoading}
                    aria-invalid={!isViewMode && Boolean(departmentError)}
                    aria-describedby={!isViewMode && departmentError ? `${departmentSelectId}-error` : undefined}
                    {...form.register("departmentId")}
                >
                    <option value="">{t("positions.departmentPlaceholder")}</option>
                    {activeDepartments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                            {dept.name}
                        </option>
                    ))}
                </Select>
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
                                {t("positions.editMode")}
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

export type { PositionFormMode, PositionFormProps };
