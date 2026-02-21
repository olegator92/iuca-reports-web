import { useTranslation } from "react-i18next";
import { User } from "lucide-react";
import type { Department } from "@/entities/department/model";
import { Card, ProtectedContent } from "@/shared/ui";
import { PERMISSIONS } from "@/shared/lib";
import { RemoveSupervisorButton } from "./RemoveSupervisorButton";

interface DepartmentSupervisorsListProps {
    department: Department;
}

export const DepartmentSupervisorsList = ({ department }: DepartmentSupervisorsListProps) => {
    const { t } = useTranslation();

    if (department.supervisors.length === 0) {
        return (
            <div className="text-sm text-muted-foreground text-center py-8">
                {t("departments.noSupervisors")}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {department.supervisors.map((supervisor) => (
                <Card
                    key={supervisor.userId}
                    className="p-4 min-h-[48px] md:min-h-0 flex items-center justify-between gap-3"
                >
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                        <User className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                                {supervisor.fullName}
                            </div>
                            <div className="text-xs text-muted-foreground truncate mt-0.5">
                                {supervisor.email}
                            </div>
                        </div>
                    </div>
                    <ProtectedContent requiredPermissions={[PERMISSIONS.DEPARTMENT_EDIT]}>
                        <RemoveSupervisorButton department={department} supervisor={supervisor} />
                    </ProtectedContent>
                </Card>
            ))}
        </div>
    );
};
