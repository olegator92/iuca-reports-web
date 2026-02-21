import type { ReactNode } from "react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRestoreDepartmentMutation } from "@/entities/department/model";
import {
    Button,
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/ui";

interface DepartmentRestoreButtonProps {
    id: string;
    name: string;
    onRestored?: () => void;
    children?: ReactNode;
}

export const DepartmentRestoreButton = ({
    id,
    name,
    onRestored,
    children,
}: DepartmentRestoreButtonProps) => {
    const [open, setOpen] = useState(false);
    const [restoreDepartment, { isLoading }] = useRestoreDepartmentMutation();
    const { t } = useTranslation();

    const handleRestore = useCallback(async (): Promise<boolean> => {
        try {
            await restoreDepartment(id).unwrap();
            onRestored?.();
            return true;
        } catch {
            return false;
        }
    }, [restoreDepartment, id, onRestored]);

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
                    event.stopPropagation();
                }}
            >
                <DialogHeader>
                    <DialogTitle>{t("departments.restoreTitle")}</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    {t("departments.restoreConfirm", { name })}
                </p>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isLoading}
                        className="min-h-[48px] md:min-h-0"
                    >
                        {t("common.cancel")}
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
                        {t("common.restore")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
