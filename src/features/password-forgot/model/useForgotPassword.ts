import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForgotPasswordMutation } from "@/entities/auth";
import { createForgotPasswordFormSchema, type ForgotPasswordFormData } from "./validation";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface UseForgotPasswordOptions {
    onSuccess?: () => void;
}

export const useForgotPassword = (options?: UseForgotPasswordOptions) => {
    const { t } = useTranslation();
    const [forgotPassword, { isLoading: isSubmitting }] = useForgotPasswordMutation();

    const form = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(createForgotPasswordFormSchema(t)),
        defaultValues: {
            email: ""
        },
        mode: "onSubmit"
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        try {
            await forgotPassword({
                email: data.email
            }).unwrap();

            toast.success(t("password.forgotSuccess"));
            options?.onSuccess?.();
            form.reset();
        } catch {
            // Errors handled by global error handler
        }
    };

    return {
        form,
        onSubmit: form.handleSubmit(onSubmit),
        isSubmitting
    };
};
