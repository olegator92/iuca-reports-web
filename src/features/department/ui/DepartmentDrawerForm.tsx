import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useCreateDepartmentMutation, useUpdateDepartmentMutation } from "@/entities/department/model";
import type { Department } from "@/entities/department/model";
import { departmentFormSchema, type DepartmentFormData } from "../model/validation";
import { DepartmentForm } from "./DepartmentForm";

interface BaseDepartmentDrawerFormProps {
    submitLabel?: string;
    onCancel?: () => void;
    onSuccess?: (department: Department) => void;
    hideFooter?: boolean;
    onFormStateChange?: (state: { isSubmitting: boolean; hasChanges: boolean }) => void;
}

interface CreateDepartmentDrawerFormProps extends BaseDepartmentDrawerFormProps {
    mode: "create";
    defaultParentDepartmentId?: string | null;
}

interface ExistingDepartmentDrawerFormProps extends BaseDepartmentDrawerFormProps {
    mode: "edit" | "view";
    department: Department;
    onModeChange?: (mode: "view" | "edit") => void;
}

type DepartmentDrawerFormProps = CreateDepartmentDrawerFormProps | ExistingDepartmentDrawerFormProps;

const CreateDepartmentDrawerForm = ({
    submitLabel,
    onCancel,
    onSuccess,
    hideFooter,
    onFormStateChange,
    defaultParentDepartmentId,
}: CreateDepartmentDrawerFormProps) => {
    const { t } = useTranslation();
    const [createDepartment, { isLoading: isSubmitting }] = useCreateDepartmentMutation();

    const form = useForm<DepartmentFormData>({
        resolver: zodResolver(departmentFormSchema),
        defaultValues: { name: "", parentDepartmentId: defaultParentDepartmentId ?? null },
        mode: "onSubmit"
    });

    React.useEffect(() => {
        onFormStateChange?.({ isSubmitting, hasChanges: true });
    }, [isSubmitting, onFormStateChange]);

    const onSubmit = async (data: DepartmentFormData) => {
        try {
            const result = await createDepartment({
                name: data.name,
                parentDepartmentId: data.parentDepartmentId ?? null
            }).unwrap();
            if (result?.data) {
                onSuccess?.(result.data);
            }
            form.reset();
        } catch {
            // handled globally
        }
    };

    return (
        <DepartmentForm
            mode="create"
            form={form}
            isSubmitting={isSubmitting}
            onSubmit={form.handleSubmit(onSubmit)}
            onCancel={onCancel}
            submitLabel={submitLabel ?? t("departments.createTitle")}
            hideFooter={hideFooter}
        />
    );
};

const ExistingDepartmentDrawerForm = ({
    mode,
    department,
    submitLabel,
    onCancel,
    onSuccess,
    onModeChange,
    hideFooter,
    onFormStateChange,
}: ExistingDepartmentDrawerFormProps) => {
    const { t } = useTranslation();
    const [updateDepartment, { isLoading: isSubmitting }] = useUpdateDepartmentMutation();

    const defaultValues: DepartmentFormData = {
        name: department.name,
        parentDepartmentId: department.parentDepartmentId
    };

    const form = useForm<DepartmentFormData>({
        resolver: zodResolver(departmentFormSchema),
        defaultValues,
        mode: "onSubmit"
    });

    // Reset form when department changes
    React.useEffect(() => {
        form.reset({
            name: department.name,
            parentDepartmentId: department.parentDepartmentId
        });
    }, [department.id, department.name, department.parentDepartmentId, form]);

    const hasChanges = form.formState.isDirty;

    React.useEffect(() => {
        onFormStateChange?.({ isSubmitting, hasChanges });
    }, [isSubmitting, hasChanges, onFormStateChange]);

    const handleCancel = () => {
        if (mode === "edit") {
            form.reset();
        }
        onCancel?.();
    };

    const handleSubmit = (e: React.FormEvent) => {
        if (mode === "view") {
            e.preventDefault();
            return;
        }
        form.handleSubmit(async (data: DepartmentFormData) => {
            try {
                const result = await updateDepartment({
                    id: department.id,
                    dto: {
                        name: data.name,
                        parentDepartmentId: data.parentDepartmentId ?? null
                    }
                }).unwrap();
                onSuccess?.(result.data ?? department);
                form.reset(data);
            } catch {
                // handled globally
            }
        })(e);
    };

    return (
        <DepartmentForm
            mode={mode}
            form={form}
            isSubmitting={isSubmitting}
            disableSubmit={mode === "edit" && !hasChanges}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            onModeChange={onModeChange}
            submitLabel={submitLabel ?? t("departments.editTitle")}
            hideFooter={hideFooter}
            currentDepartmentId={department.id}
        />
    );
};

export const DepartmentDrawerForm = (props: DepartmentDrawerFormProps) => {
    if (props.mode === "create") {
        return <CreateDepartmentDrawerForm {...props} />;
    }
    return <ExistingDepartmentDrawerForm {...props} />;
};

export type { DepartmentDrawerFormProps };
