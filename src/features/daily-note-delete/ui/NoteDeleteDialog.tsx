import { useTranslation } from "react-i18next";
import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/shared/ui";
import { useNoteDelete } from "../model/useNoteDelete";

interface NoteDeleteDialogProps {
    noteId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export const NoteDeleteDialog = ({ noteId, open, onOpenChange, onSuccess }: NoteDeleteDialogProps) => {
    const { t } = useTranslation();
    const { handleDelete, isLoading } = useNoteDelete({
        onSuccess: () => {
            onSuccess?.();
            onOpenChange(false);
        }
    });

    const onConfirm = async () => {
        if (!noteId) return;
        await handleDelete(noteId);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>{t("deleteNote.title")}</DialogTitle>
                    <DialogDescription>{t("deleteNote.description")}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                        className="min-h-[48px] md:min-h-0"
                    >
                        {t("deleteNote.cancel")}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        isLoading={isLoading}
                        disabled={isLoading}
                        className="min-h-[48px] md:min-h-0"
                    >
                        {t("deleteNote.confirm")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
