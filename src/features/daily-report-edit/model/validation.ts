import { z } from "zod";

export const reportEditSchema = z.object({
    content: z.string().min(1).max(20000).trim(),
    status: z.enum(["InProgress", "Generated"])
});

export type ReportEditFormData = z.infer<typeof reportEditSchema>;
