import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResetPasswordMutation } from "@/entities/auth";
import { createResetPasswordFormSchema, type ResetPasswordFormData } from "./validation";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface UseResetPasswordOptions {
    onSuccess?: () => void;
    defaultEmail?: string;
    defaultToken?: string;
}

export const useResetPassword = (options?: UseResetPasswordOptions) => {
    const { t } = useTranslation();
    const [resetPassword, { isLoading: isSubmitting }] = useResetPasswordMutation();

    const form = useForm<ResetPasswordFormData>({
        resolver: zodResolver(createResetPasswordFormSchema(t)),
        defaultValues: {
            email: options?.defaultEmail || "",
            token: options?.defaultToken || "",
            newPassword: "",
            confirmPassword: ""
        },
        mode: "onSubmit"
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        try {
            await resetPassword({
                email: data.email,
                token: data.token,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword
            }).unwrap();

            toast.success(t("password.resetSuccess"));
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
