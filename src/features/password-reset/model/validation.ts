import { z } from "zod";
import type { TFunction } from "i18next";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const createResetPasswordFormSchema = (t: TFunction) => z.object({
    email: z
        .string()
        .min(1, { message: t("validation.emailRequired") })
        .email({ message: t("validation.emailInvalid") })
        .trim(),
    token: z
        .string()
        .min(1, { message: t("validation.tokenRequired") }),
    newPassword: z
        .string()
        .min(8, { message: t("validation.passwordMinLength") })
        .regex(passwordRegex, {
            message: t("validation.passwordComplexity")
        }),
    confirmPassword: z
        .string()
        .min(1, { message: t("validation.confirmPasswordRequired") })
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: t("validation.passwordsNoMatch"),
    path: ["confirmPassword"]
});

export type ResetPasswordFormData = z.infer<ReturnType<typeof createResetPasswordFormSchema>>;
