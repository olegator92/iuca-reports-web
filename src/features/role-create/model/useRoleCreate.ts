import { useCreateRoleMutation } from "@/entities/role";
import type { Role } from "@/entities/role";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { roleFormSchema, type RoleFormData } from "./validation";

interface UseRoleCreateOptions {
    onSuccess?: (role: Role) => void;
}

export const useRoleCreate = (options?: UseRoleCreateOptions) => {
    const { t } = useTranslation();
    const [createRole, { isLoading: isSubmitting }] = useCreateRoleMutation();

    const form = useForm<RoleFormData>({
        resolver: zodResolver(roleFormSchema),
        defaultValues: {
            name: ""
        },
        mode: "onSubmit"
    });

    const onSubmit = async (data: RoleFormData) => {
        try {
            const result = await createRole({
                name: data.name
            }).unwrap();
            if (result) {
                toast.success(result.message || t("roleForm.roleCreated"));
                options?.onSuccess?.(result.role);
            }
            form.reset();
        } catch {
            // Error handled by global error handler
        }
    };

    return {
        form,
        onSubmit: form.handleSubmit(onSubmit),
        isSubmitting
    };
};
