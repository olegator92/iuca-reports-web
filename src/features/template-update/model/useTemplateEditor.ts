import { useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    useUpdateTemplateMutation,
    type Template,
} from "@/entities/template/model";
import { useTranslation } from "react-i18next";
import { templateFormSchema, type TemplateFormData } from "@/features/template/model/validation";

interface UseTemplateEditorOptions {
    template: Template;
    onSuccess?: (template: Template) => void;
}

export const useTemplateEditor = ({
    template,
    onSuccess,
}: UseTemplateEditorOptions) => {
    const { t } = useTranslation();
    const [updateTemplate, { isLoading }] = useUpdateTemplateMutation();

    const form = useForm<TemplateFormData>({
        resolver: zodResolver(templateFormSchema),
        defaultValues: {
            name: template.name,
            description: template.description ?? "",
        },
        mode: "onSubmit",
    });

    useEffect(() => {
        form.reset({
            name: template.name,
            description: template.description ?? "",
        });
    }, [template.name, template.description, form]);

    const formValues = form.watch();

    const hasChanges = useMemo(() => {
        const trimmedName = formValues.name.trim();
        const trimmedDescription = (formValues.description || "").trim();
        const templateName = template.name.trim();
        const templateDescription = (template.description ?? "").trim();

        return trimmedName !== templateName || trimmedDescription !== templateDescription;
    }, [formValues, template.name, template.description]);

    const reset = useCallback(() => {
        form.reset({
            name: template.name,
            description: template.description ?? "",
        });
    }, [template.name, template.description, form]);

    const onSubmit = async (data: TemplateFormData) => {
        if (!hasChanges) {
            toast.message(t("templateForm.noChanges"));
            return;
        }

        try {
            const result = await updateTemplate({
                id: template.id,
                name: data.name,
                description: data.description || "",
            }).unwrap();
            const updated = result?.data ?? {
                ...template,
                name: data.name,
                description: data.description || "",
            };
            onSuccess?.(updated);
        } catch {
            // handled by mutation toast
        }
    };

    return {
        form,
        onSubmit: form.handleSubmit(onSubmit),
        isSubmitting: isLoading,
        hasChanges,
        reset,
    };
};
