import { z } from "zod";

export const reportEditSchema = z.object({
    content: z.string().min(1).max(20000).trim()
});

export type ReportEditFormData = z.infer<typeof reportEditSchema>;
