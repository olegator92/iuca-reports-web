import { z } from "zod";

export const weeklyReportEditSchema = z.object({
    content: z.string().min(1).max(50000).trim()
});

export type WeeklyReportEditFormData = z.infer<typeof weeklyReportEditSchema>;
