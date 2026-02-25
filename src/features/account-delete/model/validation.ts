import { z } from "zod";
import type { TFunction } from "i18next";

export const createDeleteAccountFormSchema = (t: TFunction, hasPassword: boolean) => z.object({
    password: hasPassword
        ? z.string().min(1, { message: t("validation.passwordRequired") })
        : z.string(),
    reason: z.string()
});

export type DeleteAccountFormData = z.infer<ReturnType<typeof createDeleteAccountFormSchema>>;
