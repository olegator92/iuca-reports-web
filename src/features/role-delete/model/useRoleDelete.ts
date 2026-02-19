import { useCallback } from "react";
import { useDeleteRoleMutation } from "@/entities/role";
import { useNavigateWithLoading } from "@/shared/lib";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface UseRoleDeleteOptions {
    navigateAfterDelete?: boolean;
    onSuccess?: () => void;
}

export const useRoleDelete = (
    id: string,
    options?: UseRoleDeleteOptions
) => {
    const { t } = useTranslation();
    const navigate = useNavigateWithLoading();
    const [deleteRole, { isLoading }] = useDeleteRoleMutation();

    const navigateAfterDelete = options?.navigateAfterDelete ?? false;

    const handleDelete = useCallback(async (): Promise<boolean> => {
        try {
            const result = await deleteRole(id).unwrap();
            toast.success(result.message || t("roleForm.roleDeleted"));
            options?.onSuccess?.();
            if (navigateAfterDelete) {
                navigate("/roles");
            }
            return true;
        } catch {
            return false;
        }
    }, [deleteRole, id, navigate, navigateAfterDelete, options, t]);

    return { handleDelete, isLoading };
};
