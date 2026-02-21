import { useId, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { UseFormReturn } from "react-hook-form";
import { Button, Combobox, FormField, Input, Loader } from "@/shared/ui";
import type { ComboboxOption } from "@/shared/ui";
import { useGetAllDepartmentsQuery } from "@/entities/department/model";
import type { Department } from "@/entities/department/model";
import { AssignSupervisorButton, DepartmentSupervisorsList } from "@/features/department-supervisors";
import type { DepartmentFormData } from "../model/validation";

type DepartmentFormMode = "create" | "edit" | "view";

interface DepartmentFormProps {
    mode: DepartmentFormMode;
    form: UseFormReturn<DepartmentFormData>;
    isSubmitting: boolean;
    disableSubmit?: boolean;
    submitLabel?: string;
    isLoading?: boolean;
    currentDepartmentId?: string;
    department?: Department;
    onSubmit: (e: React.FormEvent) => void;
    onCancel?: () => void;
    onModeChange?: (mode: "view" | "edit") => void;
    hideFooter?: boolean;
}

export const DepartmentForm = ({
    mode,
    form,
    isSubmitting,
    disableSubmit,
    submitLabel,
    isLoading,
    currentDepartmentId,
    department,
    onSubmit,
    onCancel,
    onModeChange,
    hideFooter,
}: DepartmentFormProps) => {
    const { t } = useTranslation();
    const nameInputId = useId();
    const parentInputId = useId();

    const isViewMode = mode === "view";
    const isCreateMode = mode === "create";
    const resolvedSubmitLabel =
        submitLabel ??
        (isCreateMode ? t("departments.createTitle") : t("departments.editTitle"));
    const cancelLabel = isViewMode ? t("common.close") : t("common.cancel");

    const { data: allDepartments = [], isLoading: isDepartmentsLoading } = useGetAllDepartmentsQuery();

    const parentOptions: ComboboxOption[] = useMemo(() => {
        const filtered = currentDepartmentId
            ? allDepartments.filter((d) => d.id !== currentDepartmentId)
            : allDepartments;
        return [
            { value: "", label: t("departments.noParent") },
            ...filtered.map((d) => ({ value: d.id, label: d.name }))
        ];
    }, [allDepartments, currentDepartmentId, t]);

    const currentParentValue = form.watch("parentDepartmentId") ?? "";

    if (isLoading) {
        return <Loader className="py-8" label={t("common.loading")} />;
    }

    const nameError = form.formState.errors.name?.message;
    const showSupervisorsSection = !isCreateMode && department;

    return (
        <form id="department-form" onSubmit={onSubmit} className="space-y-4">
            <FormField
                id={nameInputId}
                label={t("departments.nameLabel")}
                error={!isViewMode ? nameError : undefined}
            >
                <Input
                    id={nameInputId}
                    placeholder={t("departments.namePlaceholder")}
                    disabled={isViewMode}
                    aria-invalid={!isViewMode && Boolean(nameError)}
                    aria-describedby={!isViewMode && nameError ? `${nameInputId}-error` : undefined}
                    {...form.register("name")}
                />
            </FormField>
            <FormField
                id={parentInputId}
                label={t("departments.parentLabel")}
            >
                {isDepartmentsLoading ? (
                    <Loader mode="inline" size="sm" label={t("common.loading")} />
                ) : (
                    <Combobox
                        value={currentParentValue}
                        onChange={(value) => {
                            form.setValue("parentDepartmentId", value || null);
                        }}
                        options={parentOptions}
                        placeholder={t("departments.parentPlaceholder")}
                        disabled={isViewMode}
                        aria-label={t("departments.parentLabel")}
                    />
                )}
            </FormField>

            {showSupervisorsSection && (
                <div className="space-y-4 pt-6 border-t border-border">
                    <section aria-label={t("departments.supervisorsSection")}>
                        <div className="flex items-center justify-between gap-2">
                            <h3 className="text-sm font-medium">
                                {t("departments.supervisorsLabel")}
                            </h3>
                            {mode === "edit" && (
                                <AssignSupervisorButton department={department} />
                            )}
                        </div>
                        <div className="mt-3">
                            <DepartmentSupervisorsList department={department} />
                        </div>
                    </section>
                </div>
            )}

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
                                {t("common.edit")}
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

export type { DepartmentFormMode, DepartmentFormProps };
