import { z } from "zod";
import type { TFunction } from "i18next";

export const createUpdateProfileFormSchema = (t: TFunction) => z.object({
    fullName: z
        .string()
        .min(1, { message: t("validation.fullNameRequired") })
        .min(2, { message: t("validation.fullNameMinLength") })
        .max(100, { message: t("validation.fullNameMaxLength") })
});

export type UpdateProfileFormData = z.infer<ReturnType<typeof createUpdateProfileFormSchema>>;
