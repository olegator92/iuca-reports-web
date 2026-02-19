import { useAddTemplateMutation } from "@/entities/template/model";
import type { Template } from "@/entities/template/model";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { templateFormSchema, type TemplateFormData } from "@/features/template/model/validation";

interface UseTemplateCreateOptions {
    onSuccess?: (template: Template) => void;
}

export const useTemplateCreate = (options?: UseTemplateCreateOptions) => {
    const [addTemplate, { isLoading: isSubmitting }] = useAddTemplateMutation();

    const form = useForm<TemplateFormData>({
        resolver: zodResolver(templateFormSchema),
        defaultValues: {
            name: "",
            description: "",
        },
        mode: "onSubmit",
    });

    const onSubmit = async (data: TemplateFormData) => {
        try {
            const result = await addTemplate({
                name: data.name,
                description: data.description || "",
            }).unwrap();
            if (result?.data) {
                options?.onSuccess?.(result.data);
            }
            form.reset();
        } catch {
            // toast handled in mutation hook
        }
    };

    return {
        form,
        onSubmit: form.handleSubmit(onSubmit),
        isSubmitting,
    };
};
