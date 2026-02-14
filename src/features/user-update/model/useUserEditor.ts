import { useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    useUpdateUserMutation,
    type User,
} from "@/entities/user/api";
import { useTranslation } from "react-i18next";
import { userFormSchema, type UserFormData } from "@/features/user/model/validation";

interface UseUserEditorOptions {
    user: User;
    onSuccess?: (user: User) => void;
}

export const useUserEditor = ({
    user,
    onSuccess,
}: UseUserEditorOptions) => {
    const { t } = useTranslation();
    const [updateUser, { isLoading }] = useUpdateUserMutation();

    const form = useForm<UserFormData>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            email: user.email,
            fullName: user.fullName,
            password: "",
        },
        mode: "onSubmit",
    });

    useEffect(() => {
        form.reset({
            email: user.email,
            fullName: user.fullName,
            password: "",
        });
    }, [user.email, user.fullName, form]);

    const formValues = form.watch();

    const hasChanges = useMemo(() => {
        const trimmedEmail = formValues.email.trim();
        const trimmedFullName = formValues.fullName.trim();
        const userEmail = user.email.trim();
        const userFullName = user.fullName.trim();

        return (
            trimmedEmail !== userEmail ||
            trimmedFullName !== userFullName ||
            (formValues.password && formValues.password.length > 0)
        );
    }, [formValues, user.email, user.fullName]);

    const reset = useCallback(() => {
        form.reset({
            email: user.email,
            fullName: user.fullName,
            password: "",
        });
    }, [user.email, user.fullName, form]);

    const onSubmit = async (data: UserFormData) => {
        if (!hasChanges) {
            toast.message(t("userForm.noChanges"));
            return;
        }

        try {
            const result = await updateUser({
                id: user.id,
                email: data.email,
                fullName: data.fullName,
                password: data.password && data.password.length > 0 ? data.password : undefined,
            }).unwrap();
            const updated = result?.data ?? {
                ...user,
                email: data.email,
                fullName: data.fullName,
            };
            onSuccess?.(updated);
            // Clear password field after successful update
            form.setValue("password", "");
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
