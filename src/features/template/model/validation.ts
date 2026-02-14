import { z } from "zod";
import i18n from "@/shared/config/i18n";

export const templateFormSchema = z.object({
    name: z
        .string()
        .min(1, { message: i18n.t("templateForm.errorNameRequired") })
        .trim(),
    description: z
        .string()
        .transform((val) => val.trim()),
});

export type TemplateFormData = z.infer<typeof templateFormSchema>;
