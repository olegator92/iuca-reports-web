import type { ReactNode } from "react";
import { useState } from "react";
import { useTemplateRestore } from "../model";
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

interface RestoreTemplateButtonProps {
    id: string;
    onRestored?: () => void;
    children?: ReactNode;
}

export const RestoreTemplateButton = ({
    id,
    onRestored,
    children,
}: RestoreTemplateButtonProps) => {
    const [open, setOpen] = useState(false);
    const { handleRestore, isLoading } = useTemplateRestore(id, {
        onSuccess: onRestored,
    });
    const { t } = useTranslation();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children ?? (
                    <Button variant="default" className="min-h-[48px] md:min-h-0">
                        {t("common.restore")}
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
                    <DialogTitle>{t("restoreTemplate.title")}</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    {t("restoreTemplate.description")}
                </p>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isLoading}
                        className="min-h-[48px] md:min-h-0"
                    >
                        {t("restoreTemplate.cancel")}
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
                        {t("restoreTemplate.confirm")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
