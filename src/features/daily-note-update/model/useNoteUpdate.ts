import { useUpdateDailyNoteMutation } from "@/entities/daily-note";
import type { DailyNote } from "@/entities/daily-note";

interface UseNoteUpdateOptions {
    onSuccess?: (note: DailyNote) => void;
}

export const useNoteUpdate = (options?: UseNoteUpdateOptions) => {
    const [updateDailyNote, { isLoading }] = useUpdateDailyNoteMutation();

    const handleUpdate = async (id: string, content: string, noteDate: string, positionId: string): Promise<boolean> => {
        try {
            const result = await updateDailyNote({ id, content, noteDate, positionId }).unwrap();
            options?.onSuccess?.(result.data);
            return true;
        } catch {
            return false;
        }
    };

    return { handleUpdate, isLoading };
};
