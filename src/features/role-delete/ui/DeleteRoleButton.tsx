import type { ReactNode } from "react";
import { useState } from "react";
import { useRoleDelete } from "../model";
import {
    Button,
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/shared/ui";
import { useTranslation } from "react-i18next";

interface DeleteRoleButtonProps {
    id: string;
    isSystemRole: boolean;
    onDeleted?: () => void;
    navigateAfterDelete?: boolean;
    children?: ReactNode;
}

export const DeleteRoleButton = ({
    id,
    isSystemRole,
    onDeleted,
    navigateAfterDelete = false,
    children
}: DeleteRoleButtonProps) => {
    const [open, setOpen] = useState(false);
    const { handleDelete, isLoading } = useRoleDelete(id, {
        navigateAfterDelete,
        onSuccess: onDeleted
    });
    const { t } = useTranslation();

    // System roles cannot be deleted
    if (isSystemRole) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children ?? (
                    <Button variant="destructive" className="min-h-[48px] md:min-h-0">
                        {t("common.delete")}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent
                className="max-w-sm"
                onPointerDown={(event) => {
                    // Stop propagation so the parent dropdown stays mounted while the dialog is active
                    event.stopPropagation();
                }}
            >
                <DialogHeader>
                    <DialogTitle>{t("deleteRole.title")}</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    {t("deleteRole.description")}
                </p>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isLoading}
                        className="min-h-[48px] md:min-h-0"
                    >
                        {t("deleteRole.cancel")}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={async () => {
                            const success = await handleDelete();
                            if (success) {
                                setOpen(false);
                            }
                        }}
                        isLoading={isLoading}
                        className="min-h-[48px] md:min-h-0"
                    >
                        {t("deleteRole.confirm")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
