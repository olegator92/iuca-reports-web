import type { ReactNode } from "react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDeleteDepartmentMutation } from "@/entities/department/model";
import {
    Button,
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/ui";

interface DepartmentDeleteButtonProps {
    id: string;
    name: string;
    onDeleted?: () => void;
    children?: ReactNode;
}

export const DepartmentDeleteButton = ({
    id,
    name,
    onDeleted,
    children,
}: DepartmentDeleteButtonProps) => {
    const [open, setOpen] = useState(false);
    const [deleteDepartment, { isLoading }] = useDeleteDepartmentMutation();
    const { t } = useTranslation();

    const handleDelete = useCallback(async (): Promise<boolean> => {
        try {
            await deleteDepartment(id).unwrap();
            return true;
        } catch {
            return false;
        }
    }, [deleteDepartment, id]);

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
                    event.stopPropagation();
                }}
            >
                <DialogHeader>
                    <DialogTitle>{t("departments.deleteTitle")}</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    {t("departments.deleteConfirm", { name })}
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
                        {t("common.delete")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
