import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChangePasswordMutation } from "@/entities/auth";
import { createChangePasswordFormSchema, type ChangePasswordFormData } from "./validation";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface UseChangePasswordOptions {
    onSuccess?: () => void;
}

export const useChangePassword = (options?: UseChangePasswordOptions) => {
    const { t } = useTranslation();
    const [changePassword, { isLoading: isSubmitting }] = useChangePasswordMutation();

    const form = useForm<ChangePasswordFormData>({
        resolver: zodResolver(createChangePasswordFormSchema(t)),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        },
        mode: "onSubmit"
    });

    const onSubmit = async (data: ChangePasswordFormData) => {
        try {
            await changePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword
            }).unwrap();

            toast.success(t("password.changeSuccess"));
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
