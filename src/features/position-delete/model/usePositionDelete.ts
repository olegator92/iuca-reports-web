import { useCallback } from "react";
import { useDeletePositionMutation } from "@/entities/position";
import { useNavigateWithLoading } from "@/shared/lib";

interface UsePositionDeleteOptions {
    navigateAfterDelete?: boolean;
}

export const usePositionDelete = (
    id: string,
    options?: UsePositionDeleteOptions,
) => {
    const navigate = useNavigateWithLoading();
    const [deletePosition, { isLoading }] = useDeletePositionMutation();

    const navigateAfterDelete = options?.navigateAfterDelete ?? true;

    const handleDelete = useCallback(async (): Promise<boolean> => {
        try {
            await deletePosition(id).unwrap();
            if (navigateAfterDelete) {
                navigate("/");
            }
            return true;
        } catch {
            return false;
        }
    }, [deletePosition, id, navigate, navigateAfterDelete]);

    return { handleDelete, isLoading };
};
