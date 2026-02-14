import { useId } from "react";
import { useTranslation } from "react-i18next";
import type { UseFormReturn } from "react-hook-form";
import { Button, FormField, Input, PasswordInput } from "@/shared/ui";
import type { ResetPasswordFormData } from "../model/validation";

interface ResetPasswordFormProps {
    form: UseFormReturn<ResetPasswordFormData, any>;
    isSubmitting: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export const ResetPasswordForm = ({
    form,
    isSubmitting,
    onSubmit
}: ResetPasswordFormProps) => {
    const { t } = useTranslation();
    const emailInputId = useId();
    const newPasswordId = useId();
    const confirmPasswordId = useId();

    const { errors } = form.formState;

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <FormField
                id={emailInputId}
                label={t("auth.emailLabel")}
                error={errors.email?.message}
            >
                <Input
                    id={emailInputId}
                    type="email"
                    placeholder={t("auth.emailPlaceholder")}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? `${emailInputId}-error` : undefined}
                    {...form.register("email")}
                />
            </FormField>

            {/* Hidden token field - token comes from URL */}
            <input type="hidden" {...form.register("token")} />

            <FormField
                id={newPasswordId}
                label={t("password.newPasswordLabel")}
                error={errors.newPassword?.message}
            >
                <PasswordInput
                    id={newPasswordId}
                    placeholder={t("password.newPasswordPlaceholder")}
                    aria-invalid={Boolean(errors.newPassword)}
                    aria-describedby={errors.newPassword ? `${newPasswordId}-error` : undefined}
                    {...form.register("newPassword")}
                />
            </FormField>

            <FormField
                id={confirmPasswordId}
                label={t("auth.confirmPasswordLabel")}
                error={errors.confirmPassword?.message}
            >
                <PasswordInput
                    id={confirmPasswordId}
                    placeholder={t("auth.confirmPasswordPlaceholder")}
                    aria-invalid={Boolean(errors.confirmPassword)}
                    aria-describedby={errors.confirmPassword ? `${confirmPasswordId}-error` : undefined}
                    {...form.register("confirmPassword")}
                />
            </FormField>

            <div className="pt-2">
                <Button
                    type="submit"
                    className="w-full"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                >
                    {t("password.resetButton")}
                </Button>
            </div>
        </form>
    );
};

