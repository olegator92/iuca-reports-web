import { useCallback } from "react";
import { useDeleteUserMutation } from "@/entities/user/api";
import { useNavigateWithLoading } from "@/shared/lib";
import { ROUTES } from "@/shared/config/routes";

interface UseUserDeleteOptions {
    navigateAfterDelete?: boolean;
    onSuccess?: () => void;
}

export const useUserDelete = (
    id: string,
    options?: UseUserDeleteOptions,
) => {
    const navigate = useNavigateWithLoading();
    const [deleteUser, { isLoading }] = useDeleteUserMutation();

    const navigateAfterDelete = options?.navigateAfterDelete ?? false;

    const handleDelete = useCallback(async (): Promise<boolean> => {
        try {
            await deleteUser(id).unwrap();
            if (navigateAfterDelete) {
                navigate(ROUTES.USERS);
            }
            options?.onSuccess?.();
            return true;
        } catch {
            return false;
        }
    }, [deleteUser, id, navigate, navigateAfterDelete, options]);

    return { handleDelete, isLoading };
};
