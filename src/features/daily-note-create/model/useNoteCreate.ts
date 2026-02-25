import { useCreateDailyNoteMutation } from "@/entities/daily-note";
import type { DailyNote } from "@/entities/daily-note";

interface UseNoteCreateOptions {
    onSuccess?: (note: DailyNote) => void;
}

export const useNoteCreate = (options?: UseNoteCreateOptions) => {
    const [createDailyNote, { isLoading }] = useCreateDailyNoteMutation();

    const handleCreate = async (content: string, noteDate: string, positionId: string): Promise<boolean> => {
        try {
            const result = await createDailyNote({ content, noteDate, positionId }).unwrap();
            options?.onSuccess?.(result.data);
            return true;
        } catch {
            return false;
        }
    };

    return { handleCreate, isLoading };
};
