import type { ReactNode } from "react";
import { useState } from "react";
import { useTemplateDelete } from "../model";
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

interface DeleteTemplateButtonProps {
    id: string;
    onDeleted?: () => void;
    navigateAfterDelete?: boolean;
    children?: ReactNode;
}

export const DeleteTemplateButton = ({
    id,
    onDeleted,
    navigateAfterDelete = true,
    children,
}: DeleteTemplateButtonProps) => {
    const [open, setOpen] = useState(false);
    const { handleDelete, isLoading } = useTemplateDelete(id, {
        navigateAfterDelete,
    });
    const { t } = useTranslation();

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
                    <DialogTitle>{t("deleteTemplate.title")}</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    {t("deleteTemplate.description")}
                </p>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isLoading}
                        className="min-h-[48px] md:min-h-0"
                    >
                        {t("deleteTemplate.cancel")}
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
                        {t("deleteTemplate.confirm")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
