import { useId } from "react";
import { useTranslation } from "react-i18next";
import type { UseFormReturn } from "react-hook-form";
import { Button, FormField, Input, PasswordInput } from "@/shared/ui";
import type { RegisterFormData } from "../model/validation";

interface RegisterFormProps {
    form: UseFormReturn<RegisterFormData>;
    isSubmitting: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export const RegisterForm = ({ form, isSubmitting, onSubmit }: RegisterFormProps) => {
    const { t } = useTranslation();
    const fullNameInputId = useId();
    const emailInputId = useId();
    const passwordInputId = useId();
    const confirmPasswordInputId = useId();

    const { errors } = form.formState;

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <FormField
                id={fullNameInputId}
                label={t("auth.fullNameLabel")}
                error={errors.fullName?.message}
            >
                <Input
                    id={fullNameInputId}
                    placeholder={t("auth.fullNamePlaceholder")}
                    aria-invalid={Boolean(errors.fullName)}
                    aria-describedby={errors.fullName ? `${fullNameInputId}-error` : undefined}
                    {...form.register("fullName")}
                />
            </FormField>

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

            <FormField
                id={passwordInputId}
                label={t("auth.passwordLabel")}
                error={errors.password?.message}
            >
                <PasswordInput
                    id={passwordInputId}
                    placeholder={t("auth.passwordPlaceholder")}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? `${passwordInputId}-error` : undefined}
                    {...form.register("password")}
                />
            </FormField>

            <FormField
                id={confirmPasswordInputId}
                label={t("auth.confirmPasswordLabel")}
                error={errors.confirmPassword?.message}
            >
                <PasswordInput
                    id={confirmPasswordInputId}
                    placeholder={t("auth.confirmPasswordPlaceholder")}
                    aria-invalid={Boolean(errors.confirmPassword)}
                    aria-describedby={errors.confirmPassword ? `${confirmPasswordInputId}-error` : undefined}
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
                    {t("auth.registerButton")}
                </Button>
            </div>
        </form>
    );
};

