import { z } from "zod";

export const createNoteSchema = z.object({
    content: z.string().min(1).max(5000).trim(),
    noteDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    positionId: z.string().min(1)
});

export const updateNoteSchema = z.object({
    content: z.string().min(1).max(5000).trim(),
    noteDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    positionId: z.string().min(1)
});

export type CreateNoteFormData = z.infer<typeof createNoteSchema>;
export type UpdateNoteFormData = z.infer<typeof updateNoteSchema>;
