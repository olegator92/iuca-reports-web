import { useCallback, useMemo } from "react";
import { useGetRolesQuery, type Role } from "@/entities/role";

export interface UseRoleListResult {
    isInitialLoading: boolean;
    roles: Role[];
    total: number;
    loadedCount: number;
    refetch: () => void;
    handleRoleCreated: (role: Role) => void;
    handleRoleUpdated: (role: Role) => void;
    handleRoleDeleted: (roleId: string) => void;
}

export const useRoleList = (): UseRoleListResult => {
    const { data: roles = [], isLoading, refetch } = useGetRolesQuery();

    const handleRoleCreated = useCallback(
        (_role: Role) => {
            // RTK Query will automatically update the cache when a role is created
            // via the cache invalidation tags
            refetch();
        },
        [refetch]
    );

    const handleRoleUpdated = useCallback(
        (_role: Role) => {
            // RTK Query will automatically update the cache when a role is updated
            // via the cache invalidation tags
            refetch();
        },
        [refetch]
    );

    const handleRoleDeleted = useCallback(
        (_roleId: string) => {
            // RTK Query will automatically update the cache when a role is deleted
            // via the cache invalidation tags
            refetch();
        },
        [refetch]
    );

    const total = useMemo(() => roles.length, [roles.length]);
    const loadedCount = useMemo(() => roles.length, [roles.length]);

    return {
        isInitialLoading: isLoading,
        roles,
        total,
        loadedCount,
        refetch,
        handleRoleCreated,
        handleRoleUpdated,
        handleRoleDeleted
    };
};
