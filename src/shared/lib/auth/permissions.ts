import type { CurrentUser } from "@/entities/auth";

/**
 * Permission checking utilities
 */

export const PERMISSIONS = {
    // Wildcard - full access
    ALL: "*",

    // Template permissions
    TEMPLATE_VIEW: "Template.View",
    TEMPLATE_EDIT: "Template.Edit",

    // User permissions
    USER_VIEW: "User.View",
    USER_EDIT: "User.Edit",
    USER_ROLE_EDIT: "User.RoleEdit",

    // Department permissions
    DEPARTMENT_VIEW: "Department.View",
    DEPARTMENT_EDIT: "Department.Edit",

    // Position permissions
    POSITION_VIEW: "Position.View",
    POSITION_EDIT: "Position.Edit",

    // Role permissions
    ROLE_VIEW: "Role.View",
    ROLE_EDIT: "Role.Edit",

    // Daily Note permissions
    DAILY_NOTE_VIEW: "DailyNote.View",

    // Daily Report permissions
    DAILY_REPORT_VIEW: "DailyReport.View",
    DAILY_REPORT_EDIT: "DailyReport.Edit",

    // Weekly Report permissions
    WEEKLY_REPORT_VIEW: "WeeklyReport.View",
    WEEKLY_REPORT_EDIT: "WeeklyReport.Edit",

    // Supervisor Report permissions
    SUPERVISOR_REPORT_VIEW: "SupervisorReport.View",
    SUPERVISOR_DAILY_REPORT_VIEW: "SupervisorDailyReport.View",

    // Menu group permissions
    MENU_ADMINISTRATION: "Menu.Administration",
    MENU_MANAGEMENT: "Menu.Management",
    MENU_REPORTS: "Menu.Reports"
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

export const SYSTEM_ROLES = {
    ADMIN: "Admin",
    MANAGER: "Manager",
    USER: "User"
} as const;

export type SystemRole = typeof SYSTEM_ROLES[keyof typeof SYSTEM_ROLES];

/**
 * Check if user has a specific role
 */
export const hasRole = (user: CurrentUser | null, role: string): boolean => {
    if (!user) return false;
    return user.roles.includes(role);
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (user: CurrentUser | null, roles: string[]): boolean => {
    if (!user) return false;
    return roles.some(role => user.roles.includes(role));
};

/**
 * Check if user has all of the specified roles
 */
export const hasAllRoles = (user: CurrentUser | null, roles: string[]): boolean => {
    if (!user) return false;
    return roles.every(role => user.roles.includes(role));
};

/**
 * Check if user is an admin (has Admin role)
 */
export const isAdmin = (user: CurrentUser | null): boolean => {
    return hasRole(user, SYSTEM_ROLES.ADMIN);
};

/**
 * Check if user is a manager (has Manager role)
 */
export const isManager = (user: CurrentUser | null): boolean => {
    return hasRole(user, SYSTEM_ROLES.MANAGER);
};

/**
 * Check if user has actual permissions (fetched from backend and stored in user object)
 * This checks the permissions array on the user object if available
 */
export const hasActualPermission = (user: CurrentUser & { permissions?: string[] }, permission: Permission): boolean => {
    if (!user || !user.permissions) return false;

    // Check for wildcard permission first - grants access to everything
    if (user.permissions.includes(PERMISSIONS.ALL)) {
        return true;
    }

    // Check for specific permission
    return user.permissions.includes(permission);
};

/**
 * Note: Permission checking is role-based on the backend.
 * Frontend role checks should match backend permission structure:
 * - Admin role has * (wildcard - all permissions)
 * - Manager role has Template.Edit, User.View, User.Edit, Role.View, Menu.Management
 * - User role has Template.View
 *
 * For accurate permission checking, fetch actual permissions from backend
 * using GET /api/permissions/users/{userId} endpoint and store in Redux state
 */

/**
 * Simple permission check based on roles
 * This is a client-side approximation - always verify on backend
 *
 * IMPORTANT: If user has actual permissions loaded (user.permissions array),
 * use hasActualPermission instead for accurate permission checking
 */
export const hasPermission = (user: CurrentUser | null, permission: Permission): boolean => {
    if (!user) return false;

    // If user has permissions loaded (even if empty array), use actual permissions
    // Empty array means user has no permissions (not the same as undefined/not loaded)
    const userWithPermissions = user as CurrentUser & { permissions?: string[] };
    if (userWithPermissions.permissions !== undefined) {
        return hasActualPermission(userWithPermissions, permission);
    }

    // Fallback to role-based approximation (only if permissions were never loaded)
    // Admin has all permissions (wildcard)
    if (isAdmin(user)) return true;

    // Manager permissions
    if (isManager(user)) {
        const managerPermissions = [
            PERMISSIONS.TEMPLATE_VIEW,
            PERMISSIONS.TEMPLATE_EDIT,
            PERMISSIONS.USER_VIEW,
            PERMISSIONS.USER_EDIT,
            PERMISSIONS.ROLE_VIEW,
            PERMISSIONS.DEPARTMENT_VIEW,
            PERMISSIONS.DEPARTMENT_EDIT,
            PERMISSIONS.POSITION_VIEW,
            PERMISSIONS.POSITION_EDIT,
            PERMISSIONS.DAILY_NOTE_VIEW,
            PERMISSIONS.DAILY_REPORT_VIEW,
            PERMISSIONS.DAILY_REPORT_EDIT,
            PERMISSIONS.WEEKLY_REPORT_VIEW,
            PERMISSIONS.WEEKLY_REPORT_EDIT,
            PERMISSIONS.MENU_MANAGEMENT,
        ];
        return (managerPermissions as Permission[]).includes(permission);
    }

    // Regular user permissions
    if (hasRole(user, SYSTEM_ROLES.USER)) {
        return (
            permission === PERMISSIONS.TEMPLATE_VIEW ||
            permission === PERMISSIONS.DAILY_NOTE_VIEW ||
            permission === PERMISSIONS.DAILY_REPORT_VIEW ||
            permission === PERMISSIONS.WEEKLY_REPORT_VIEW ||
            permission === PERMISSIONS.WEEKLY_REPORT_EDIT
        );
    }

    return false;
};

/**
 * Check if user has any of the specified permissions
 */
export const hasAnyPermission = (user: CurrentUser | null, permissions: Permission[]): boolean => {
    return permissions.some(permission => hasPermission(user, permission));
};

/**
 * Check if user has all of the specified permissions
 */
export const hasAllPermissions = (user: CurrentUser | null, permissions: Permission[]): boolean => {
    return permissions.every(permission => hasPermission(user, permission));
};
