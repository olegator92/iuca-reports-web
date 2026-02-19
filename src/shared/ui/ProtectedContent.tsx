import { ReactNode } from "react";
import { useAuth, useHasAnyPermission, useHasAnyRole, type Permission } from "@/shared/lib";

interface ProtectedContentProps {
    children: ReactNode;
    /**
     * Require authentication to show content
     */
    requireAuth?: boolean;
    /**
     * User must have at least one of these permissions
     */
    requiredPermissions?: Permission[];
    /**
     * User must have at least one of these roles
     */
    requiredRoles?: string[];
    /**
     * Content to show when user doesn't have access (optional)
     */
    fallback?: ReactNode;
}

/**
 * ProtectedContent - Conditionally renders children based on auth state, permissions, or roles
 *
 * @example
 * // Only show for authenticated users
 * <ProtectedContent requireAuth>
 *   <Button>Authenticated Only</Button>
 * </ProtectedContent>
 *
 * @example
 * // Only show for users with specific permissions
 * <ProtectedContent requiredPermissions={[PERMISSIONS.TEMPLATE_DELETE]}>
 *   <DeleteButton />
 * </ProtectedContent>
 *
 * @example
 * // Only show for admins
 * <ProtectedContent requiredRoles={[SYSTEM_ROLES.ADMIN]}>
 *   <AdminPanel />
 * </ProtectedContent>
 */
export const ProtectedContent = ({
    children,
    requireAuth = false,
    requiredPermissions,
    requiredRoles,
    fallback = null
}: ProtectedContentProps) => {
    const { isAuthenticated } = useAuth();
    const hasPermission = useHasAnyPermission(requiredPermissions ?? []);
    const hasRole = useHasAnyRole(requiredRoles ?? []);

    // Check authentication
    if (requireAuth && !isAuthenticated) {
        return <>{fallback}</>;
    }

    // Check permissions
    if (requiredPermissions && requiredPermissions.length > 0 && !hasPermission) {
        return <>{fallback}</>;
    }

    // Check roles
    if (requiredRoles && requiredRoles.length > 0 && !hasRole) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};
