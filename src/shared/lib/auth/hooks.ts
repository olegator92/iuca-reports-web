import { useSelector } from "react-redux";
import type { CurrentUser } from "@/entities/auth";
import {
    selectIsAuthenticated,
    selectCurrentUser,
    selectAccessToken,
    selectUserRoles,
    selectUserFullName,
    selectAuthLoading
} from "./authSelectors";
import {
    hasRole,
    hasAnyRole,
    hasAllRoles,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
    isManager,
    type Permission
} from "./permissions";

/**
 * Hook to get authentication status
 */
export const useAuth = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectCurrentUser);
    const accessToken = useSelector(selectAccessToken);
    const isLoading = useSelector(selectAuthLoading);

    return {
        isAuthenticated,
        user,
        accessToken,
        isLoading
    };
};

/**
 * Hook to get current user
 */
export const useCurrentUser = (): CurrentUser | null => {
    return useSelector(selectCurrentUser);
};

/**
 * Hook to get user's full name
 */
export const useUserFullName = (): string | null => {
    return useSelector(selectUserFullName);
};

/**
 * Hook to get user's roles
 */
export const useUserRoles = (): string[] => {
    return useSelector(selectUserRoles);
};

/**
 * Hook to check if user has a specific role
 */
export const useHasRole = (role: string): boolean => {
    const user = useCurrentUser();
    return hasRole(user, role);
};

/**
 * Hook to check if user has any of the specified roles
 */
export const useHasAnyRole = (roles: string[]): boolean => {
    const user = useCurrentUser();
    return hasAnyRole(user, roles);
};

/**
 * Hook to check if user has all of the specified roles
 */
export const useHasAllRoles = (roles: string[]): boolean => {
    const user = useCurrentUser();
    return hasAllRoles(user, roles);
};

/**
 * Hook to check if user is an admin
 */
export const useIsAdmin = (): boolean => {
    const user = useCurrentUser();
    return isAdmin(user);
};

/**
 * Hook to check if user is a manager
 */
export const useIsManager = (): boolean => {
    const user = useCurrentUser();
    return isManager(user);
};

/**
 * Hook to check if user has a specific permission
 */
export const useHasPermission = (permission: Permission): boolean => {
    const user = useCurrentUser();
    return hasPermission(user, permission);
};

/**
 * Hook to check if user has any of the specified permissions
 */
export const useHasAnyPermission = (permissions: Permission[]): boolean => {
    const user = useCurrentUser();
    return hasAnyPermission(user, permissions);
};

/**
 * Hook to check if user has all of the specified permissions
 */
export const useHasAllPermissions = (permissions: Permission[]): boolean => {
    const user = useCurrentUser();
    return hasAllPermissions(user, permissions);
};
