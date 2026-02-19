import { useUpdateTemplateMutation, useGetTemplateByIdQuery } from "@/entities/template/model";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROUTES } from "@/shared/config";
import { templateFormSchema, type TemplateFormData } from "@/features/template/model/validation";
import { useNavigateWithLoading } from "@/shared/lib";

export const useTemplateUpdate = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigateWithLoading();
    const { t } = useTranslation();

    const shouldSkip = useMemo(() => !id || id.trim().length === 0, [id]);

    const { data: template, isFetching } = useGetTemplateByIdQuery(id ?? "", {
        skip: shouldSkip,
    });

    const form = useForm<TemplateFormData>({
        resolver: zodResolver(templateFormSchema),
        defaultValues: {
            name: "",
            description: "",
        },
        mode: "onSubmit",
    });

    useEffect(() => {
        if (template) {
            form.reset({
                name: template.name,
                description: template.description ?? "",
            });
        }
    }, [template, form]);

    const [updateTemplate, { isLoading: isUpdating }] = useUpdateTemplateMutation();

    const onSubmit = async (data: TemplateFormData) => {
        if (!id) {
            toast.error(t("templateForm.errorMissingId"));
            return;
        }

        try {
            await updateTemplate({
                id,
                name: data.name,
                description: data.description || "",
            }).unwrap();
            navigate(ROUTES.HOME);
        } catch {
            // handled by mutation toast
        }
    };

    const isInitialLoading = isFetching || shouldSkip;

    return {
        form,
        onSubmit: form.handleSubmit(onSubmit),
        isLoading: isInitialLoading,
        isSubmitting: isUpdating,
    };
};
