import { ROUTES } from "./routes";
import { PERMISSIONS, type Permission } from "@/shared/lib/auth/permissions";

export interface NavItem {
    to: string;
    labelKey: string;
    end?: boolean;
    permission?: Permission;
}

export interface NavGroup {
    id: string;
    labelKey: string;
    items: NavItem[];
    permission?: Permission; // Optional permission requirement for the entire group
}

export type NavConfig = (NavItem | NavGroup)[];

// Ungrouped home item
const HOME_ITEM: NavItem = {
    to: ROUTES.HOME,
    labelKey: "navigation.home",
    end: true
};

// Navigation groups
const MANAGEMENT_GROUP: NavGroup = {
    id: "management",
    labelKey: "navigation.groups.management",
    permission: PERMISSIONS.MENU_MANAGEMENT,
    items: [
        { to: ROUTES.USERS, labelKey: "navigation.users", permission: PERMISSIONS.USER_VIEW },
        { to: ROUTES.DEPARTMENTS, labelKey: "navigation.departments", permission: PERMISSIONS.DEPARTMENT_VIEW }
    ]
};

const ADMINISTRATION_GROUP: NavGroup = {
    id: "administration",
    labelKey: "navigation.groups.administration",
    permission: PERMISSIONS.MENU_ADMINISTRATION,
    items: [
        { to: ROUTES.TEMPLATES, labelKey: "navigation.templates", permission: PERMISSIONS.TEMPLATE_VIEW },
        { to: ROUTES.ROLES, labelKey: "navigation.roles", permission: PERMISSIONS.ROLE_VIEW },
    ]
};

// Main navigation configuration
export const NAV_CONFIG: NavConfig = [
    HOME_ITEM,
    ADMINISTRATION_GROUP,
    MANAGEMENT_GROUP,
];

// Legacy export for backwards compatibility
export const NAV_ITEMS: NavItem[] = [
    { to: ROUTES.HOME, labelKey: "navigation.home", end: true },
    { to: ROUTES.USERS, labelKey: "navigation.users", permission: PERMISSIONS.USER_VIEW },
    { to: ROUTES.TEMPLATES, labelKey: "navigation.templates", permission: PERMISSIONS.TEMPLATE_VIEW },
    { to: ROUTES.ROLES, labelKey: "navigation.roles", permission: PERMISSIONS.ROLE_VIEW },
];

export const TERMS_ITEMS: NavItem[] = [
    { to: ROUTES.PRIVACY_POLICY, labelKey: "navigation.privacyPolicy" },
    { to: ROUTES.TERMS_OF_USE, labelKey: "navigation.termsOfUse" },
];
