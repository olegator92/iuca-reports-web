import { z } from "zod";
import type { TFunction } from "i18next";

export const createForgotPasswordFormSchema = (t: TFunction) => z.object({
    email: z
        .string()
        .min(1, { message: t("validation.emailRequired") })
        .email({ message: t("validation.emailInvalid") })
        .trim()
});

export type ForgotPasswordFormData = z.infer<ReturnType<typeof createForgotPasswordFormSchema>>;
