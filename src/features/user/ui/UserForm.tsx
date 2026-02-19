import { useId } from "react";
import { useTranslation } from "react-i18next";
import type { UseFormReturn } from "react-hook-form";

import { Button, FormField, Input, Loader, PasswordInput } from "@/shared/ui";
import type { UserFormData } from "../model/validation";

type UserFormMode = "create" | "edit" | "view";

interface UserFormProps {
    mode: UserFormMode;
    form: UseFormReturn<UserFormData, any>;
    isSubmitting: boolean;
    disableSubmit?: boolean;
    submitLabel?: string;
    isLoading?: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onCancel?: () => void;
    onModeChange?: (mode: "view" | "edit") => void;
    hideFooter?: boolean;
}

export const UserForm = ({
    mode,
    form,
    isSubmitting,
    disableSubmit,
    submitLabel,
    isLoading,
    onSubmit,
    onCancel,
    onModeChange,
    hideFooter,
}: UserFormProps) => {
    const { t } = useTranslation();
    const emailInputId = useId();
    const fullNameInputId = useId();
    const passwordInputId = useId();

    const isViewMode = mode === "view";
    const isCreateMode = mode === "create";
    const resolvedSubmitLabel =
        submitLabel ??
        (isCreateMode ? t("userForm.createSubmit") : t("userForm.updateSubmit"));
    const cancelLabel = isViewMode ? t("common.close") : t("userForm.cancel");

    if (isLoading) {
        return <Loader className="py-8" label={t("common.loading")} />;
    }

    const emailError = form.formState.errors.email?.message;
    const fullNameError = form.formState.errors.fullName?.message;
    const passwordError = form.formState.errors.password?.message;

    return (
        <form id="user-form" onSubmit={onSubmit} className="space-y-4">
            <FormField
                id={emailInputId}
                label={t("userForm.emailLabel")}
                error={!isViewMode ? emailError : undefined}
            >
                <Input
                    id={emailInputId}
                    type="email"
                    placeholder={t("userForm.emailPlaceholder")}
                    disabled={isViewMode}
                    aria-invalid={!isViewMode && Boolean(emailError)}
                    aria-describedby={!isViewMode && emailError ? `${emailInputId}-error` : undefined}
                    {...form.register("email")}
                />
            </FormField>
            <FormField
                id={fullNameInputId}
                label={t("userForm.fullNameLabel")}
                error={!isViewMode ? fullNameError : undefined}
            >
                <Input
                    id={fullNameInputId}
                    placeholder={t("userForm.fullNamePlaceholder")}
                    disabled={isViewMode}
                    aria-invalid={!isViewMode && Boolean(fullNameError)}
                    aria-describedby={!isViewMode && fullNameError ? `${fullNameInputId}-error` : undefined}
                    {...form.register("fullName")}
                />
            </FormField>
            <FormField
                id={passwordInputId}
                label={t("userForm.passwordLabel")}
                optional={!isCreateMode}
                error={!isViewMode ? passwordError : undefined}
            >
                <PasswordInput
                    id={passwordInputId}
                    placeholder={t("userForm.passwordPlaceholder")}
                    disabled={isViewMode}
                    showToggle={!isViewMode}
                    aria-invalid={!isViewMode && Boolean(passwordError)}
                    aria-describedby={!isViewMode && passwordError ? `${passwordInputId}-error` : undefined}
                    {...form.register("password")}
                />
            </FormField>
            {!hideFooter && (
                <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
                    {onCancel ? (
                        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} className="min-h-[48px] md:min-h-0">
                            {cancelLabel}
                        </Button>
                    ) : null}
                    {isViewMode ? (
                        onModeChange ? (
                            <Button type="button" onClick={() => onModeChange("edit")} className="min-h-[48px] md:min-h-0">
                                {t("userForm.editMode")}
                            </Button>
                        ) : null
                    ) : (
                        <Button type="submit" isLoading={isSubmitting} disabled={disableSubmit} className="min-h-[48px] md:min-h-0">
                            {resolvedSubmitLabel}
                        </Button>
                    )}
                </div>
            )}
        </form>
    );
};

export type { UserFormMode };
