import { useCallback } from "react";
import { useRestorePositionMutation } from "@/entities/position";

interface UsePositionRestoreOptions {
    onSuccess?: () => void;
}

export const usePositionRestore = (
    id: string,
    options?: UsePositionRestoreOptions,
) => {
    const [restorePosition, { isLoading }] = useRestorePositionMutation();

    const handleRestore = useCallback(async (): Promise<boolean> => {
        try {
            await restorePosition(id).unwrap();
            options?.onSuccess?.();
            return true;
        } catch {
            return false;
        }
    }, [restorePosition, id, options]);

    return { handleRestore, isLoading };
};
