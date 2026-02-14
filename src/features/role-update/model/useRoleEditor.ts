import { useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateRoleMutation, type Role } from "@/entities/role";
import { useTranslation } from "react-i18next";
import { roleFormSchema, type RoleFormData } from "@/features/role-create";

interface UseRoleEditorOptions {
    role: Role;
    onSuccess?: (role: Role) => void;
}

export const useRoleEditor = ({
    role,
    onSuccess
}: UseRoleEditorOptions) => {
    const { t } = useTranslation();
    const [updateRole, { isLoading }] = useUpdateRoleMutation();

    const form = useForm<RoleFormData>({
        resolver: zodResolver(roleFormSchema),
        defaultValues: {
            name: role.name
        },
        mode: "onSubmit"
    });

    useEffect(() => {
        form.reset({
            name: role.name
        });
    }, [role.name, form]);

    const formValues = form.watch();

    const hasChanges = useMemo(() => {
        const trimmedName = formValues.name.trim();
        const roleName = role.name.trim();

        return trimmedName !== roleName;
    }, [formValues, role.name]);

    const reset = useCallback(() => {
        form.reset({
            name: role.name
        });
    }, [role.name, form]);

    const onSubmit = async (data: RoleFormData) => {
        if (!hasChanges) {
            toast.message(t("roleForm.noChanges"));
            return;
        }

        try {
            const result = await updateRole({
                id: role.id,
                body: { name: data.name }
            }).unwrap();
            const updated = result?.role ?? {
                ...role,
                name: data.name
            };
            toast.success(result.message || t("roleForm.roleUpdated"));
            onSuccess?.(updated);
        } catch {
            // Error handled by global error handler
        }
    };

    return {
        form,
        onSubmit: form.handleSubmit(onSubmit),
        isSubmitting: isLoading,
        hasChanges,
        reset
    };
};
