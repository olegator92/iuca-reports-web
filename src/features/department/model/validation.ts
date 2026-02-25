import { z } from "zod";
import i18n from "@/shared/config/i18n";

export const departmentFormSchema = z.object({
    name: z
        .string()
        .min(1, { message: i18n.t("departments.nameRequired") })
        .max(200, { message: i18n.t("departments.nameTooLong") })
        .trim(),
    parentDepartmentId: z.string().nullable().optional()
});

export type DepartmentFormData = z.infer<typeof departmentFormSchema>;
