import { useId } from "react";
import { useTranslation } from "react-i18next";
import type { UseFormReturn } from "react-hook-form";
import { Button, FormField, PasswordInput } from "@/shared/ui";
import type { ChangePasswordFormData } from "../model/validation";

interface ChangePasswordFormProps {
    form: UseFormReturn<ChangePasswordFormData>;
    isSubmitting: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onCancel?: () => void;
}

export const ChangePasswordForm = ({
    form,
    isSubmitting,
    onSubmit,
    onCancel
}: ChangePasswordFormProps) => {
    const { t } = useTranslation();
    const currentPasswordId = useId();
    const newPasswordId = useId();
    const confirmPasswordId = useId();

    const { errors } = form.formState;

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <FormField
                id={currentPasswordId}
                label={t("password.currentPasswordLabel")}
                error={errors.currentPassword?.message}
            >
                <PasswordInput
                    id={currentPasswordId}
                    placeholder={t("password.currentPasswordPlaceholder")}
                    aria-invalid={Boolean(errors.currentPassword)}
                    aria-describedby={errors.currentPassword ? `${currentPasswordId}-error` : undefined}
                    {...form.register("currentPassword")}
                />
            </FormField>

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

            <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="min-h-[48px] md:min-h-0"
                    >
                        {t("common.cancel")}
                    </Button>
                )}
                <Button
                    type="submit"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                    className="min-h-[48px] md:min-h-0"
                >
                    {t("password.changeButton")}
                </Button>
            </div>
        </form>
    );
};
