import type { ReactNode } from "react";
import { useState } from "react";
import { usePositionRestore } from "../model";
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

interface RestorePositionButtonProps {
    id: string;
    onRestored?: () => void;
    children?: ReactNode;
}

export const RestorePositionButton = ({
    id,
    onRestored,
    children,
}: RestorePositionButtonProps) => {
    const [open, setOpen] = useState(false);
    const { handleRestore, isLoading } = usePositionRestore(id, {
        onSuccess: onRestored,
    });
    const { t } = useTranslation();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children ?? (
                    <Button variant="default" className="min-h-[48px] md:min-h-0">
                        {t("positions.restore")}
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
                    <DialogTitle>{t("positions.restoreDialog.title")}</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    {t("positions.restoreDialog.description")}
                </p>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isLoading}
                        className="min-h-[48px] md:min-h-0"
                    >
                        {t("positions.restoreDialog.cancel")}
                    </Button>
                    <Button
                        variant="default"
                        onClick={async () => {
                            const success = await handleRestore();
                            if (success) {
                                setOpen(false);
                            }
                        }}
                        isLoading={isLoading}
                        className="min-h-[48px] md:min-h-0"
                    >
                        {t("positions.restoreDialog.confirm")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
