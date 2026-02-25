import { z } from "zod";

export const weeklyReportEditSchema = z.object({
    content: z.string().min(1).max(50000).trim(),
    status: z.enum(["InProgress", "Generated"])
});

export type WeeklyReportEditFormData = z.infer<typeof weeklyReportEditSchema>;
