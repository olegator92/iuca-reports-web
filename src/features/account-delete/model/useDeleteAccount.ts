import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDeleteAccountMutation } from "@/entities/account";
import { createDeleteAccountFormSchema, type DeleteAccountFormData } from "./validation";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { DeleteAccountRequest } from "@/entities/auth";

interface UseDeleteAccountOptions {
    onSuccess?: () => void;
    hasPassword: boolean;
}

export const useDeleteAccount = (options: UseDeleteAccountOptions) => {
    const { t } = useTranslation();
    const [deleteAccount, { isLoading: isSubmitting }] = useDeleteAccountMutation();
    const { hasPassword } = options;

    const form = useForm<DeleteAccountFormData>({
        resolver: zodResolver(createDeleteAccountFormSchema(t, hasPassword)),
        defaultValues: {
            password: "",
            reason: ""
        },
        mode: "onSubmit"
    });

    const onSubmit = async (data: DeleteAccountFormData) => {
        try {
            const payload: DeleteAccountRequest = {};

            // Only include password if user has a password
            if (hasPassword && data.password) {
                payload.password = data.password;
            }

            // Only include reason if it's not empty
            if (data.reason && data.reason.trim()) {
                payload.reason = data.reason.trim();
            }

            await deleteAccount(payload).unwrap();

            toast.success(t("account.deletionScheduled"));
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
