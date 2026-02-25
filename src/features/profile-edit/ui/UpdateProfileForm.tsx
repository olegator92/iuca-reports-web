import { useId } from "react";
import { useTranslation } from "react-i18next";
import type { UseFormReturn } from "react-hook-form";
import { Button, FormField, Input } from "@/shared/ui";
import type { UpdateProfileFormData } from "../model/validation";

interface UpdateProfileFormProps {
    form: UseFormReturn<UpdateProfileFormData>;
    isSubmitting: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onCancel?: () => void;
    hideFooter?: boolean;
}

export const UpdateProfileForm = ({
    form,
    isSubmitting,
    onSubmit,
    onCancel,
    hideFooter,
}: UpdateProfileFormProps) => {
    const { t } = useTranslation();
    const fullNameId = useId();

    const { errors } = form.formState;

    return (
        <form id="profile-form" onSubmit={onSubmit} className="space-y-4">
            <FormField
                id={fullNameId}
                label={t("profile.fullNameLabel")}
                error={errors.fullName?.message}
            >
                <Input
                    id={fullNameId}
                    type="text"
                    placeholder={t("profile.fullNamePlaceholder")}
                    aria-invalid={Boolean(errors.fullName)}
                    aria-describedby={errors.fullName ? `${fullNameId}-error` : undefined}
                    {...form.register("fullName")}
                />
            </FormField>

            {!hideFooter && (
                <div className="flex w-full gap-2 pt-2 sm:justify-end">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="min-h-[48px] flex-1 sm:flex-initial md:min-h-0"
                        >
                            {t("common.cancel")}
                        </Button>
                    )}
                    <Button
                        type="submit"
                        isLoading={isSubmitting}
                        disabled={isSubmitting}
                        className="min-h-[48px] flex-1 sm:flex-initial md:min-h-0"
                    >
                        {t("profile.updateButton")}
                    </Button>
                </div>
            )}
        </form>
    );
};
