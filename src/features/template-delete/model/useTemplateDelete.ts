import { useCallback } from "react";
import { useDeleteTemplateMutation } from "@/entities/template/model";
import { useNavigateWithLoading } from "@/shared/lib";

interface UseTemplateDeleteOptions {
    navigateAfterDelete?: boolean;
}

export const useTemplateDelete = (
    id: string,
    options?: UseTemplateDeleteOptions,
) => {
    const navigate = useNavigateWithLoading();
    const [deleteTemplate, { isLoading }] = useDeleteTemplateMutation();

    const navigateAfterDelete = options?.navigateAfterDelete ?? true;

    const handleDelete = useCallback(async (): Promise<boolean> => {
        try {
            await deleteTemplate(id).unwrap();
            if (navigateAfterDelete) {
                navigate("/");
            }
            return true;
        } catch {
            return false;
        }
    }, [deleteTemplate, id, navigate, navigateAfterDelete]);

    return { handleDelete, isLoading };
};
