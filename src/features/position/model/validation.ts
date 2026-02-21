import { z } from "zod";
import i18n from "@/shared/config/i18n";

export const positionFormSchema = z.object({
    name: z
        .string()
        .min(1, { message: i18n.t("positionForm.errorNameRequired", { ns: "positions" }) })
        .trim(),
    departmentId: z
        .string()
        .min(1, { message: i18n.t("positionForm.errorDepartmentRequired", { ns: "positions" }) })
});

export type PositionFormData = z.infer<typeof positionFormSchema>;
