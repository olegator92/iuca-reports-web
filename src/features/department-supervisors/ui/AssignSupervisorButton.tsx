import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { User } from "lucide-react";
import type { Department } from "@/entities/department/model";
import { useAssignDepartmentSupervisorMutation } from "@/entities/department/api";
import { useGetAllUsersQuery } from "@/entities/user/api";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Loader, ProtectedContent } from "@/shared/ui";
import { PERMISSIONS } from "@/shared/lib";

interface AssignSupervisorButtonProps {
    department: Department;
}

export const AssignSupervisorButton = ({ department }: AssignSupervisorButtonProps) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const { data: allUsers = [], isLoading: isLoadingUsers } = useGetAllUsersQuery();
    const [assignSupervisor, { isLoading: isAssigning }] = useAssignDepartmentSupervisorMutation();

    // Filter out already-assigned supervisors and inactive users
    const assignedUserIds = department.supervisors.map((s) => s.userId);
    const availableUsers = allUsers.filter(
        (user) => user.isActive && !assignedUserIds.includes(user.id)
    );

    const handleClose = () => {
        setIsOpen(false);
        setSelectedUserId(null);
    };

    const handleAssign = async () => {
        if (!selectedUserId) return;

        try {
            await assignSupervisor({
                departmentId: department.id,
                userId: selectedUserId
            }).unwrap();
            handleClose();
        } catch {
            // Error handled by global error handler
        }
    };

    return (
        <ProtectedContent requiredPermissions={[PERMISSIONS.DEPARTMENT_EDIT]}>
            <Button
                type="button"
                onClick={() => setIsOpen(true)}
                size="sm"
                className="min-h-[48px] md:min-h-0 w-full sm:w-auto"
            >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">{t("departments.assignSupervisor")}</span>
            </Button>

            <Dialog open={isOpen} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{t("departments.assignSupervisorTitle")}</DialogTitle>
                    </DialogHeader>

                    <div className="py-4">
                        {isLoadingUsers ? (
                            <Loader className="py-8" label={t("common.loading")} />
                        ) : availableUsers.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                {t("departments.noAvailableSupervisors")}
                            </p>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground mb-4">
                                    {t("departments.assignSupervisorDescription")}
                                </p>
                                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                    {availableUsers.map((user) => (
                                        <button
                                            key={user.id}
                                            onClick={() => setSelectedUserId(user.id)}
                                            className={`w-full text-left p-3 rounded-lg border min-h-[48px] md:min-h-0 transition-colors ${
                                                selectedUserId === user.id
                                                    ? "border-primary bg-primary/10"
                                                    : "border-border hover:border-primary/50 hover:bg-accent"
                                            }`}
                                        >
                                            <div className="flex items-start gap-2">
                                                <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-sm">
                                                        {user.fullName}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground mt-0.5">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            disabled={isAssigning}
                            className="min-h-[48px] md:min-h-0"
                        >
                            {t("common.cancel")}
                        </Button>
                        <Button
                            onClick={handleAssign}
                            disabled={!selectedUserId || isAssigning}
                            className="min-h-[48px] md:min-h-0"
                        >
                            {isAssigning ? t("common.loading") : t("departments.assign")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </ProtectedContent>
    );
};
