import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSetPasswordMutation } from "@/entities/auth";
import { createSetPasswordFormSchema, type SetPasswordFormData } from "./validation";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface UseSetPasswordOptions {
    onSuccess?: () => void;
}

export const useSetPassword = (options?: UseSetPasswordOptions) => {
    const { t } = useTranslation();
    const [setPassword, { isLoading: isSubmitting }] = useSetPasswordMutation();

    const form = useForm<SetPasswordFormData>({
        resolver: zodResolver(createSetPasswordFormSchema(t)),
        defaultValues: {
            newPassword: "",
            confirmPassword: ""
        },
        mode: "onSubmit"
    });

    const onSubmit = async (data: SetPasswordFormData) => {
        try {
            await setPassword({
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword
            }).unwrap();

            toast.success(t("password.setSuccess"));
            form.reset();
            options?.onSuccess?.();
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
