import { useCallback } from "react";
import { useRestoreTemplateMutation } from "@/entities/template/api";

interface UseTemplateRestoreOptions {
    onSuccess?: () => void;
}

export const useTemplateRestore = (
    id: string,
    options?: UseTemplateRestoreOptions,
) => {
    const [restoreTemplate, { isLoading }] = useRestoreTemplateMutation();

    const handleRestore = useCallback(async (): Promise<boolean> => {
        try {
            await restoreTemplate(id).unwrap();
            options?.onSuccess?.();
            return true;
        } catch {
            return false;
        }
    }, [restoreTemplate, id, options]);

    return { handleRestore, isLoading };
};
