import { z } from "zod";
import type { TFunction } from "i18next";

// Password validation rules as per backend requirements:
// - Minimum 8 characters
// - At least 1 uppercase letter
// - At least 1 lowercase letter
// - At least 1 digit
// - At least 1 special character

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const createRegisterFormSchema = (t: TFunction) => z.object({
    email: z
        .string()
        .min(1, { message: t("validation.emailRequired") })
        .email({ message: t("validation.emailInvalid") })
        .trim(),
    password: z
        .string()
        .min(8, { message: t("validation.passwordMinLength") })
        .regex(passwordRegex, {
            message: t("validation.passwordComplexity")
        }),
    confirmPassword: z
        .string()
        .min(1, { message: t("validation.confirmPasswordRequired") }),
    fullName: z
        .string()
        .min(1, { message: t("validation.fullNameRequired") })
        .max(200, { message: t("validation.fullNameMaxLength") })
        .trim()
}).refine((data) => data.password === data.confirmPassword, {
    message: t("validation.passwordsNoMatch"),
    path: ["confirmPassword"]
});

export type RegisterFormData = z.infer<ReturnType<typeof createRegisterFormSchema>>;
