import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import type { Department, DepartmentSupervisor } from "@/entities/department/model";
import { useRemoveDepartmentSupervisorMutation } from "@/entities/department/api";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/shared/ui";

interface RemoveSupervisorButtonProps {
    department: Department;
    supervisor: DepartmentSupervisor;
}

export const RemoveSupervisorButton = ({ department, supervisor }: RemoveSupervisorButtonProps) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [removeSupervisor, { isLoading }] = useRemoveDepartmentSupervisorMutation();

    const handleRemove = async () => {
        try {
            await removeSupervisor({
                departmentId: department.id,
                userId: supervisor.userId
            }).unwrap();
            setIsOpen(false);
        } catch {
            // Error handled by global error handler
        }
    };

    return (
        <>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(true)}
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
                <X className="h-4 w-4" />
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {t("departments.removeSupervisor", { name: supervisor.fullName })}
                        </DialogTitle>
                        <DialogDescription>
                            {t("departments.removeSupervisorDescription")}
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={isLoading}
                            className="min-h-[48px] md:min-h-0"
                        >
                            {t("common.cancel")}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleRemove}
                            disabled={isLoading}
                            className="min-h-[48px] md:min-h-0"
                        >
                            {isLoading ? t("common.loading") : t("common.delete")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
