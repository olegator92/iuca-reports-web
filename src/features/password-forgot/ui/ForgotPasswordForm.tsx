import { useId } from "react";
import { useTranslation } from "react-i18next";
import type { UseFormReturn } from "react-hook-form";
import { Button, FormField, Input } from "@/shared/ui";
import type { ForgotPasswordFormData } from "../model/validation";

interface ForgotPasswordFormProps {
    form: UseFormReturn<ForgotPasswordFormData, unknown>;
    isSubmitting: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export const ForgotPasswordForm = ({
    form,
    isSubmitting,
    onSubmit
}: ForgotPasswordFormProps) => {
    const { t } = useTranslation();
    const emailInputId = useId();

    const emailError = form.formState.errors.email?.message;

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <FormField
                id={emailInputId}
                label={t("auth.emailLabel")}
                error={emailError}
            >
                <Input
                    id={emailInputId}
                    type="email"
                    placeholder={t("auth.emailPlaceholder")}
                    aria-invalid={Boolean(emailError)}
                    aria-describedby={emailError ? `${emailInputId}-error` : undefined}
                    {...form.register("email")}
                />
            </FormField>

            <div className="pt-2">
                <Button
                    type="submit"
                    className="w-full"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                >
                    {t("password.forgotButton")}
                </Button>
            </div>
        </form>
    );
};

