import { z } from "zod";
import type { TFunction } from "i18next";

export const createSetPasswordFormSchema = (t: TFunction) => {
    return z.object({
        newPassword: z
            .string()
            .min(1, t("validation.required"))
            .min(8, t("validation.passwordMinLength", { min: 8 }))
            .regex(/[A-Z]/, t("validation.passwordUppercase"))
            .regex(/[a-z]/, t("validation.passwordLowercase"))
            .regex(/[0-9]/, t("validation.passwordNumber"))
            .regex(/[@$!%*?&#]/, t("validation.passwordSpecialChar")),
        confirmPassword: z
            .string()
            .min(1, t("validation.required"))
    }).refine((data) => data.newPassword === data.confirmPassword, {
        message: t("validation.passwordsDoNotMatch"),
        path: ["confirmPassword"]
    });
};

export type SetPasswordFormData = z.infer<ReturnType<typeof createSetPasswordFormSchema>>;
