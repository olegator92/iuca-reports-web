import type { CurrentUser } from "@/entities/auth";
import { permissionApi } from "@/entities/role/api/permissionApi";
import type { AppDispatch } from "@/app/stores/mainStore/mainStore";

/**
 * Helper function to load user permissions from backend and attach to user object
 * This enables wildcard permission checking and accurate permission validation
 *
 * @param user - The user object to load permissions for
 * @param dispatch - Redux dispatch function
 * @returns User object with permissions attached
 */
export const loadUserPermissions = async (
    user: CurrentUser,
    dispatch: AppDispatch
): Promise<CurrentUser> => {
    try {
        const result = await dispatch(
            permissionApi.endpoints.getUserPermissions.initiate(user.id)
        );

        if (result.data) {
            return { ...user, permissions: result.data };
        }

        return user;
    } catch {
        // If permissions loading fails, return user without permissions
        // Permission checks will fall back to role-based approximation
        return user;
    }
};
