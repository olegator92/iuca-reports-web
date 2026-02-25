import { useTranslation } from "react-i18next";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button, Input, Label } from "@/shared/ui";
import type { UseFormReturn } from "react-hook-form";
import type { SetPasswordFormData } from "../model";

interface SetPasswordFormProps {
    form: UseFormReturn<SetPasswordFormData, unknown>;
    isSubmitting: boolean;
    onSubmit: () => void;
}

export const SetPasswordForm = ({ form, isSubmitting, onSubmit }: SetPasswordFormProps) => {
    const { t } = useTranslation();
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        formState: { errors }
    } = form;

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {/* Info message */}
            <div className="rounded-md bg-blue-50 dark:bg-blue-950/20 p-3 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                    {t("password.setPasswordInfo")}
                </p>
            </div>

            {/* New Password */}
            <div className="space-y-2">
                <Label htmlFor="newPassword">
                    {t("password.newPassword")}
                </Label>
                <div className="relative">
                    <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder={t("password.enterNewPassword")}
                        disabled={isSubmitting}
                        aria-invalid={Boolean(errors.newPassword)}
                        {...register("newPassword")}
                    />
                    <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        tabIndex={-1}
                        disabled={isSubmitting}
                    >
                        {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>
                </div>
                {errors.newPassword && (
                    <p className="text-sm text-destructive">{errors.newPassword.message}</p>
                )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                    {t("password.confirmPassword")}
                </Label>
                <div className="relative">
                    <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder={t("password.confirmNewPassword")}
                        disabled={isSubmitting}
                        aria-invalid={Boolean(errors.confirmPassword)}
                        {...register("confirmPassword")}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        tabIndex={-1}
                        disabled={isSubmitting}
                    >
                        {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>
                </div>
                {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                )}
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("password.settingPassword")}
                    </>
                ) : (
                    t("password.setPassword")
                )}
            </Button>
        </form>
    );
};

