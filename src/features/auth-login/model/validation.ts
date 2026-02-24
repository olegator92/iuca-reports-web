import { z } from "zod";
import type { TFunction } from "i18next";

export const createLoginFormSchema = (t: TFunction) => z.object({
    email: z
        .string()
        .min(1, { message: t("validation.emailRequired") })
        .email({ message: t("validation.emailInvalid") })
        .trim(),
    password: z
        .string()
        .min(1, { message: t("validation.passwordRequired") }),
    rememberMe: z.boolean()
});

export type LoginFormData = z.infer<ReturnType<typeof createLoginFormSchema>>;
