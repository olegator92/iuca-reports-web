import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetRolesQuery } from "@/entities/role/api";
import type { User } from "@/entities/user/model";
import { useUserRoles } from "../model/useUserRoles";
import { Checkbox, Loader, Badge } from "@/shared/ui";

interface UserRolesManagerProps {
    user: User;
    onRolesChanged?: (user: User) => void;
}

export const UserRolesManager = ({ user, onRolesChanged }: UserRolesManagerProps) => {
    const { t } = useTranslation();
    const { data: allRoles = [], isLoading: isLoadingRoles } = useGetRolesQuery();
    const { handleAssignRole, handleRemoveRole, isLoading } = useUserRoles({
        userId: user.id,
        onSuccess: onRolesChanged
    });

    // Get user's current role IDs by matching role names
    const userRoleIds = allRoles
        .filter((role) => user.roles.includes(role.name))
        .map((role) => role.id);

    const [pendingChanges, setPendingChanges] = useState<Set<string>>(new Set());

    const handleToggleRole = async (roleId: string, isChecked: boolean) => {
        setPendingChanges((prev) => new Set(prev).add(roleId));

        if (isChecked) {
            await handleAssignRole(roleId);
        } else {
            await handleRemoveRole(roleId);
        }

        setPendingChanges((prev) => {
            const next = new Set(prev);
            next.delete(roleId);
            return next;
        });
    };

    if (isLoadingRoles) {
        return <Loader className="py-8" label={t("common.loading")} />;
    }

    return (
        <div className="space-y-4">
            <div className="space-y-3">
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold">{user.fullName}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <h4 className="text-sm font-medium">{t("userRoles.title")}</h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {allRoles.map((role) => {
                        const isChecked = userRoleIds.includes(role.id);
                        const isPending = pendingChanges.has(role.id);
                        const isDisabled = isLoading || isPending;

                        return (
                            <div key={role.id} className="flex items-start space-x-2">
                                <Checkbox
                                    id={`role-${role.id}`}
                                    checked={isChecked}
                                    onChange={(e) => handleToggleRole(role.id, e.target.checked)}
                                    disabled={isDisabled}
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <label
                                            htmlFor={`role-${role.id}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                        >
                                            {role.name}
                                        </label>
                                        {role.isSystemRole && (
                                            <Badge variant="secondary" className="text-xs">
                                                {t("userRoles.systemRole")}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
