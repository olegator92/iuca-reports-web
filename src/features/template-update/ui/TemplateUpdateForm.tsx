import { TemplateForm } from "@/features/template/ui";
import { useTemplateUpdate } from "../model";

export const TemplateUpdateForm = () => {
    const { form, onSubmit, isLoading, isSubmitting } = useTemplateUpdate();

    return (
        <TemplateForm
            mode="edit"
            form={form}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            isLoading={isLoading}
        />
    );
};
