import { z } from "zod";
import i18n from "@/shared/config/i18n";

// Password authentication is temporarily disabled (Google OAuth only)
// const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{}|;:,.<>])[A-Za-z\d@$!%*?&#^()_+\-=\[\]{}|;:,.<>]{8,}$/;

export const userFormSchema = z.object({
    email: z
        .string()
        .min(1, { message: i18n.t("userForm.errorEmailRequired") })
        .email({ message: i18n.t("userForm.errorEmailInvalid") })
        .trim(),
    fullName: z
        .string()
        .min(1, { message: i18n.t("userForm.errorFullNameRequired") })
        .max(200, { message: i18n.t("userForm.errorFullNameTooLong") })
        .trim(),
    // Password authentication is temporarily disabled (Google OAuth only)
    // password: z
    //     .string()
    //     .optional()
    //     .refine(
    //         (val) => !val || val.length === 0 || passwordRegex.test(val),
    //         {
    //             message: i18n.t("userForm.errorPasswordWeak")
    //         }
    //     )
});

export type UserFormData = z.infer<typeof userFormSchema>;
