import { useTranslation } from "react-i18next";
import { Button, Loader } from "@/shared/ui";
import { useRolePermissions } from "../model/useRolePermissions";
import { PermissionCheckbox } from "./PermissionCheckbox";
import type { Role } from "@/entities/role";

interface RolePermissionsManagerProps {
    role: Role;
    onSuccess?: () => void;
    disabled?: boolean;
}

export const RolePermissionsManager = ({
    role,
    onSuccess,
    disabled = false
}: RolePermissionsManagerProps) => {
    const { t } = useTranslation();
    const {
        allPermissions,
        selectedPermissions,
        togglePermission,
        handleSavePermissions,
        isLoading
    } = useRolePermissions({ role, onSuccess });

    if (isLoading) {
        return <Loader className="py-8" label={t("common.loading")} />;
    }

    const hasChanges = role.permissions.length !== selectedPermissions.size ||
        !role.permissions.every(p => selectedPermissions.has(p));

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <h3 className="text-sm font-medium">{t("rolePermissions.title")}</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {allPermissions.map((permission) => (
                        <PermissionCheckbox
                            key={permission}
                            permission={permission}
                            checked={selectedPermissions.has(permission)}
                            onCheckedChange={() => togglePermission(permission)}
                            disabled={disabled}
                        />
                    ))}
                </div>
            </div>
            <div className="flex justify-end pt-2">
                <Button
                    onClick={handleSavePermissions}
                    disabled={disabled || !hasChanges}
                    className="min-h-[48px] md:min-h-0"
                >
                    {t("rolePermissions.save")}
                </Button>
            </div>
        </div>
    );
};
