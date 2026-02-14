import { useCallback } from "react";
import { useAssignRoleToUserMutation, useRemoveRoleFromUserMutation, type User } from "@/entities/user/api";

interface UseUserRolesOptions {
    userId: string;
    onSuccess?: (user: User) => void;
}

export const useUserRoles = ({ userId, onSuccess }: UseUserRolesOptions) => {
    const [assignRole, { isLoading: isAssigning }] = useAssignRoleToUserMutation();
    const [removeRole, { isLoading: isRemoving }] = useRemoveRoleFromUserMutation();

    const handleAssignRole = useCallback(
        async (roleId: string): Promise<boolean> => {
            try {
                const result = await assignRole({ userId, roleId }).unwrap();
                if (result.data) {
                    onSuccess?.(result.data);
                }
                return true;
            } catch {
                return false;
            }
        },
        [assignRole, userId, onSuccess]
    );

    const handleRemoveRole = useCallback(
        async (roleId: string): Promise<boolean> => {
            try {
                const result = await removeRole({ userId, roleId }).unwrap();
                if (result.data) {
                    onSuccess?.(result.data);
                }
                return true;
            } catch {
                return false;
            }
        },
        [removeRole, userId, onSuccess]
    );

    return {
        handleAssignRole,
        handleRemoveRole,
        isLoading: isAssigning || isRemoving
    };
};
