import { useCallback, useState } from "react";
import {
    useGetAllPermissionsQuery,
    useAssignPermissionsMutation,
    useRemovePermissionMutation,
    useLazyGetUserPermissionsQuery,
    type Role
} from "@/entities/role";
import { setUser } from "@/entities/auth";
import { useAppSelector, useAppDispatch } from "@/app/stores/mainStore/hooks";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface UseRolePermissionsOptions {
    role: Role;
    onSuccess?: () => void;
}

export const useRolePermissions = ({ role, onSuccess }: UseRolePermissionsOptions) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector((state) => state.auth.user);
    const { data: allPermissions = [], isLoading: isLoadingPermissions } = useGetAllPermissionsQuery();
    const [assignPermissions, { isLoading: isAssigning }] = useAssignPermissionsMutation();
    const [removePermission, { isLoading: isRemoving }] = useRemovePermissionMutation();
    const [getUserPermissions] = useLazyGetUserPermissionsQuery();

    const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
        new Set(role.permissions)
    );

    const togglePermission = useCallback((permission: string) => {
        setSelectedPermissions((prev) => {
            const next = new Set(prev);
            if (next.has(permission)) {
                next.delete(permission);
            } else {
                next.add(permission);
            }
            return next;
        });
    }, []);

    const handleAddPermissions = useCallback(
        async (permissions: string[]) => {
            if (permissions.length === 0) {
                toast.error(t("rolePermissions.noPermissionsSelected"));
                return false;
            }

            try {
                await assignPermissions({
                    id: role.id,
                    body: {
                        roleId: role.id,
                        permissions
                    }
                }).unwrap();
                toast.success(t("rolePermissions.permissionsAssigned"));
                onSuccess?.();
                return true;
            } catch {
                // Error handled by global error handler
                return false;
            }
        },
        [assignPermissions, role.id, onSuccess, t]
    );

    const handleRemovePermission = useCallback(
        async (permission: string) => {
            try {
                await removePermission({
                    id: role.id,
                    permission
                }).unwrap();
                toast.success(t("rolePermissions.permissionRemoved"));
                onSuccess?.();
                return true;
            } catch {
                // Error handled by global error handler
                return false;
            }
        },
        [removePermission, role.id, onSuccess, t]
    );

    const refreshCurrentUserPermissions = useCallback(async () => {
        // Check if current user has the role being modified
        if (!currentUser || !currentUser.id) return;

        const userHasThisRole = currentUser.roles?.some(
            userRole => userRole.toLowerCase() === role.name.toLowerCase()
        );

        if (userHasThisRole) {
            try {
                // Refetch user permissions from backend
                const permissions = await getUserPermissions(currentUser.id).unwrap();
                // Update user in Redux with fresh permissions
                dispatch(setUser({ ...currentUser, permissions }));
            } catch {
                // If permissions fetch fails, user keeps old permissions
                // They can refresh or re-login to get updated permissions
            }
        }
    }, [currentUser, role.name, getUserPermissions, dispatch]);

    const handleSavePermissions = useCallback(async () => {
        const currentPermissions = new Set(role.permissions);
        const toAdd = Array.from(selectedPermissions).filter((p) => !currentPermissions.has(p));
        const toRemove = Array.from(currentPermissions).filter((p) => !selectedPermissions.has(p));

        try {
            // Add new permissions
            if (toAdd.length > 0) {
                await assignPermissions({
                    id: role.id,
                    body: {
                        roleId: role.id,
                        permissions: toAdd
                    }
                }).unwrap();
            }

            // Remove permissions
            for (const permission of toRemove) {
                await removePermission({
                    id: role.id,
                    permission
                }).unwrap();
            }

            toast.success(t("rolePermissions.permissionsUpdated"));

            // Refresh current user's permissions if they have this role
            await refreshCurrentUserPermissions();

            onSuccess?.();
            return true;
        } catch {
            // Error handled by global error handler
            return false;
        }
    }, [assignPermissions, removePermission, role, selectedPermissions, onSuccess, t, refreshCurrentUserPermissions]);

    return {
        allPermissions,
        currentPermissions: role.permissions,
        selectedPermissions,
        togglePermission,
        handleAddPermissions,
        handleRemovePermission,
        handleSavePermissions,
        isLoading: isLoadingPermissions || isAssigning || isRemoving
    };
};
