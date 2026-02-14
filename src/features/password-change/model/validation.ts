import { z } from "zod";
import type { TFunction } from "i18next";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const createChangePasswordFormSchema = (t: TFunction) => z.object({
    currentPassword: z
        .string()
        .min(1, { message: t("validation.currentPasswordRequired") }),
    newPassword: z
        .string()
        .min(8, { message: t("validation.passwordMinLength") })
        .regex(passwordRegex, {
            message: t("validation.passwordComplexity")
        }),
    confirmPassword: z
        .string()
        .min(1, { message: t("validation.confirmNewPasswordRequired") })
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: t("validation.passwordsNoMatch"),
    path: ["confirmPassword"]
});

export type ChangePasswordFormData = z.infer<ReturnType<typeof createChangePasswordFormSchema>>;
