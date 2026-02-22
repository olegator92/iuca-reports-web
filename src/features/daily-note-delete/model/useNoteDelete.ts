import { useDeleteDailyNoteMutation } from "@/entities/daily-note";

interface UseNoteDeleteOptions {
    onSuccess?: () => void;
}

export const useNoteDelete = (options?: UseNoteDeleteOptions) => {
    const [deleteDailyNote, { isLoading }] = useDeleteDailyNoteMutation();

    const handleDelete = async (id: string): Promise<boolean> => {
        try {
            await deleteDailyNote(id).unwrap();
            options?.onSuccess?.();
            return true;
        } catch {
            return false;
        }
    };

    return { handleDelete, isLoading };
};
