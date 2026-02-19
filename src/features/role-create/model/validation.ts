import { z } from "zod";
import i18n from "@/shared/config/i18n";

export const roleFormSchema = z.object({
    name: z
        .string()
        .min(1, { message: i18n.t("roleForm.errorNameRequired") })
        .max(256, { message: i18n.t("roleForm.errorNameTooLong") })
        .trim()
});

export type RoleFormData = z.infer<typeof roleFormSchema>;
