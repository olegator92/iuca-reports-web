import type { ReactNode } from "react";
import { useState } from "react";
import { usePositionDelete } from "../model";
import {
    Button,
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/ui";
import { useTranslation } from "react-i18next";

interface DeletePositionButtonProps {
    id: string;
    onDeleted?: () => void;
    navigateAfterDelete?: boolean;
    children?: ReactNode;
}

export const DeletePositionButton = ({
    id,
    onDeleted,
    navigateAfterDelete = true,
    children,
}: DeletePositionButtonProps) => {
    const [open, setOpen] = useState(false);
    const { handleDelete, isLoading } = usePositionDelete(id, {
        navigateAfterDelete,
    });
    const { t } = useTranslation();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children ?? (
                    <Button variant="destructive" className="min-h-[48px] md:min-h-0">
                        {t("positions.delete")}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent
                className="max-w-sm"
                onPointerDown={(event) => {
                    event.stopPropagation();
                }}
            >
                <DialogHeader>
                    <DialogTitle>{t("positions.deleteDialog.title")}</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    {t("positions.deleteDialog.description")}
                </p>
                <p className="text-sm text-muted-foreground">
                    {t("positions.deleteDialog.warningAssignedUsers")}
                </p>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isLoading}
                        className="min-h-[48px] md:min-h-0"
                    >
                        {t("positions.deleteDialog.cancel")}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={async () => {
                            const success = await handleDelete();
                            if (success) {
                                onDeleted?.();
                                setOpen(false);
                            }
                        }}
                        isLoading={isLoading}
                        className="min-h-[48px] md:min-h-0"
                    >
                        {t("positions.deleteDialog.confirm")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
