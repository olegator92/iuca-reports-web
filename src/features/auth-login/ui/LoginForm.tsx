import { useId } from "react";
import { useTranslation } from "react-i18next";
import type { UseFormReturn } from "react-hook-form";
import { Button, FormField, Input, PasswordInput, Checkbox } from "@/shared/ui";
import type { LoginFormData } from "../model/validation";

interface LoginFormProps {
    form: UseFormReturn<LoginFormData, any>;
    isSubmitting: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export const LoginForm = ({ form, isSubmitting, onSubmit }: LoginFormProps) => {
    const { t } = useTranslation();
    const emailInputId = useId();
    const passwordInputId = useId();

    const emailError = form.formState.errors.email?.message;
    const passwordError = form.formState.errors.password?.message;

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

            <FormField
                id={passwordInputId}
                label={t("auth.passwordLabel")}
                error={passwordError}
            >
                <PasswordInput
                    id={passwordInputId}
                    placeholder={t("auth.passwordPlaceholder")}
                    aria-invalid={Boolean(passwordError)}
                    aria-describedby={passwordError ? `${passwordInputId}-error` : undefined}
                    {...form.register("password")}
                />
            </FormField>

            <div className="flex items-center">
                <Checkbox
                    id="rememberMe"
                    label={t("auth.rememberMe")}
                    {...form.register("rememberMe")}
                />
            </div>

            <div className="pt-2">
                <Button
                    type="submit"
                    className="w-full"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                >
                    {t("auth.loginButton")}
                </Button>
            </div>
        </form>
    );
};

