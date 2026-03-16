import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth, useHasAnyPermission, type Permission } from "@/shared/lib";
import { ROUTES } from "@/shared/config";

interface ProtectedRouteProps {
    children: ReactNode;
    requireAuth?: boolean;
    requiredPermissions?: Permission[];
    redirectTo?: string;
}

/**
 * Protected route component that handles authentication and authorization
 *
 * @param requireAuth - If true, user must be authenticated (default: true)
 * @param requiredPermissions - Array of permissions, user must have at least one
 * @param redirectTo - Where to redirect if unauthorized (default: LOGIN or FORBIDDEN)
 */
export const ProtectedRoute = ({
    children,
    requireAuth = true,
    requiredPermissions,
    redirectTo
}: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading } = useAuth();
    const hasPermission = useHasAnyPermission(requiredPermissions ?? []);

    // Wait for auth state to load
    if (isLoading) {
        return null; // or a loading spinner
    }

    // Check authentication
    if (requireAuth && !isAuthenticated) {
        return <Navigate to={redirectTo ?? ROUTES.LOGIN} replace />;
    }

    // Check permissions
    if (requiredPermissions && requiredPermissions.length > 0 && !hasPermission) {
        return <Navigate to={redirectTo ?? ROUTES.FORBIDDEN} replace />;
    }

    return <>{children}</>;
};

/**
 * Public route component - redirects to home if already authenticated
 */
interface PublicRouteProps {
    children: ReactNode;
    redirectTo?: string;
}

export const PublicRoute = ({ children, redirectTo }: PublicRouteProps) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return null;
    }

    if (isAuthenticated) {
        return <Navigate to={redirectTo ?? ROUTES.DASHBOARD} replace />;
    }

    return <>{children}</>;
};
