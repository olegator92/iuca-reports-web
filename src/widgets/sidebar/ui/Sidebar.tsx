import type { FC } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LogOut, ChevronDown, User } from "lucide-react";
import { NAV_CONFIG, TERMS_ITEMS, ROUTES, type NavItem, type NavGroup } from "@/shared/config";
import { cn, useAuth, useCurrentUser, useNavigateWithLoading, useHasPermission } from "@/shared/lib";
import { useSidebarStore } from "@/shared/lib/stores/sidebarStore";
import { ThemeSwitcher } from "@/features/theme-switcher";
import { LanguageSwitcher } from "@/features/language-switcher";
import { useLogout } from "@/features/auth-logout";
import { Avatar, DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel, Button } from "@/shared/ui";
import { useTranslation } from "react-i18next";

type SidebarProps = {
    isOpen: boolean;
    onClose: () => void;
};

const baseLinkClasses =
    "flex items-center gap-3 px-3 py-4 md:py-3 text-sm font-medium transition-all duration-200 border-b border-sidebar-border/50 min-h-[48px] md:min-h-0";

/**
 * Navigation item component that checks permissions before rendering
 */
const ProtectedNavItem: FC<{ item: NavItem; onClose: () => void }> = ({ item, onClose }) => {
    const { t } = useTranslation();
    const { isAuthenticated } = useAuth();

    // Items without permission are always visible
    if (!item.permission) {
        return (
            <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                    cn(
                        baseLinkClasses,
                        isActive
                            ? "border-brand/60 bg-brand/15 text-foreground shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
                            : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                    )
                }
                onClick={onClose}
            >
                <span>{t(item.labelKey)}</span>
            </NavLink>
        );
    }

    // Items with permission require authentication
    if (!isAuthenticated) {
        return null;
    }

    // Check if user has the required permission
    return <PermissionCheckedNavItem item={item} onClose={onClose} />;
};

/**
 * Component that checks specific permission (only rendered if authenticated)
 */
const PermissionCheckedNavItem: FC<{ item: NavItem; onClose: () => void }> = ({ item, onClose }) => {
    const { t } = useTranslation();
    const hasPermission = useHasPermission(item.permission!);

    if (!hasPermission) {
        return null;
    }

    return (
        <NavLink
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
                cn(
                    baseLinkClasses,
                    isActive
                        ? "bg-brand/15 text-foreground shadow-[0_8px_30px_rgba(0,0,0,0.04)] border-t border-t-brand/60 border-b-brand/60"
                        : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                )
            }
            onClick={onClose}
        >
            <span>{t(item.labelKey)}</span>
        </NavLink>
    );
};

/**
 * Navigation group component with collapsible functionality
 */
const NavGroupComponent: FC<{ group: NavGroup; onClose: () => void }> = ({ group, onClose }) => {
    const { t } = useTranslation();
    const { toggleGroup, isGroupCollapsed } = useSidebarStore();
    const location = useLocation();
    const isCollapsed = isGroupCollapsed(group.id);

    // Check if user has permission to view this group
    const hasGroupPermission = useHasPermission(group.permission!);

    // If group requires permission and user doesn't have it, don't render
    if (group.permission && !hasGroupPermission) {
        return null;
    }

    // Check if any item in the group is currently active
    const hasActiveItem = group.items.some((item) => {
        if (item.end) {
            return location.pathname === item.to;
        }
        return location.pathname.startsWith(item.to);
    });

    return (
        <div className="space-y-1 border-b border-sidebar-border/70 pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0">
            <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-3 md:py-2 text-xs font-semibold uppercase tracking-[0.15em] transition-colors hover:bg-muted/40 cursor-pointer min-h-[48px] md:min-h-0",
                    hasActiveItem
                        ? "text-brand-dark dark:text-brand hover:text-brand-dark dark:hover:text-brand"
                        : "text-muted-foreground hover:text-foreground"
                )}
            >
                <span>{t(group.labelKey)}</span>
                <ChevronDown
                    className={cn(
                        "h-3.5 w-3.5 transition-transform duration-200",
                        isCollapsed ? "-rotate-90" : "rotate-0"
                    )}
                />
            </button>
            <div
                className={cn(
                    "ml-2 overflow-hidden transition-all duration-200",
                    isCollapsed ? "max-h-0 opacity-0" : "max-h-[1000px] opacity-100"
                )}
            >
                {group.items.map((item) => (
                    <ProtectedNavItem key={item.to} item={item} onClose={onClose} />
                ))}
            </div>
        </div>
    );
};

/**
 * Helper to check if config item is a group
 */
const isNavGroup = (item: NavItem | NavGroup): item is NavGroup => {
    return "items" in item;
};

export const Sidebar: FC<SidebarProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const { isAuthenticated } = useAuth();
    const user = useCurrentUser();
    const navigate = useNavigateWithLoading();
    const { logout } = useLogout({
        onSuccess: () => {
            navigate(ROUTES.LOGIN);
        }
    });

    const userFullName = user?.name || null;

    return (
        <>
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-background/70 backdrop-blur-sm transition-opacity duration-300 md:hidden",
                    isOpen
                        ? "pointer-events-auto opacity-100"
                        : "pointer-events-none opacity-0",
                )}
                aria-hidden="true"
                onClick={onClose}
            />

            <aside
                id="app-sidebar"
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-xl transition-transform duration-300 md:sticky md:top-0 md:bottom-auto md:h-screen md:max-h-screen md:w-64 md:translate-x-0 md:border-r md:shadow-none lg:w-72",
                    isOpen
                        ? "translate-x-0 pointer-events-auto"
                        : "-translate-x-full pointer-events-none md:pointer-events-auto",
                )}
            >
                <div className="flex h-full flex-col">
                    <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5 py-6 md:px-6 md:py-8 pb-0 custom-scrollbar">
                        <div className="flex justify-end md:hidden">
                            <button
                                type="button"
                                className="inline-flex h-12 w-12 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                aria-label={t("common.close")}
                                onClick={onClose}
                            >
                                <svg
                                    className="h-4 w-4"
                                    viewBox="0 0 14 14"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M3 3l8 8M11 3L3 11"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span className="sr-only">{t("common.close")}</span>
                            </button>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                {t("navigation.title")}
                            </p>
                        </div>

                        <nav
                            aria-label={t("navigation.title")}
                            className="flex flex-col"
                        >
                            {NAV_CONFIG.map((item, index) => {
                                const isGroup = isNavGroup(item);
                                const nextItem = NAV_CONFIG[index + 1];
                                const nextIsGroup = nextItem ? isNavGroup(nextItem) : false;
                                const needsSpacing = !isGroup && nextIsGroup;

                                if (isGroup) {
                                    return <NavGroupComponent key={item.id} group={item} onClose={onClose} />;
                                }

                                return (
                                    <div key={item.to} className={needsSpacing ? "mb-3" : ""}>
                                        <ProtectedNavItem item={item} onClose={onClose} />
                                    </div>
                                );
                            })}
                        </nav>

                        <div className="space-y-3 border-t border-sidebar-border/70 pt-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                {t("settings.title")}
                            </p>
                            <ThemeSwitcher />
                            <LanguageSwitcher />
                        </div>

                        <div className="space-y-3 border-t border-sidebar-border/70 pt-4 pb-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                {t("navigation.termsAndPolicies")}
                            </p>
                            <nav
                                aria-label={t("navigation.termsAndPolicies")}
                                className="flex flex-col"
                            >
                                {TERMS_ITEMS.map((item) => (
                                    <ProtectedNavItem key={item.to} item={item} onClose={onClose} />
                                ))}
                            </nav>
                        </div>
                    </div>

                    <div className="mt-auto border-t border-sidebar-border/70 px-5 py-4 md:px-6">
                        {isAuthenticated && user ? (
                            <DropdownMenu
                                align="start"
                                trigger={
                                    <div className="flex w-full cursor-pointer items-center gap-3 rounded-md px-2 py-3 md:py-2 transition-colors hover:bg-muted/40 min-h-[56px] md:min-h-0">
                                        <Avatar
                                            src={user.profilePhotoUrl}
                                            fallback={userFullName || undefined}
                                            size="md"
                                        />
                                        <div className="flex flex-1 flex-col overflow-hidden text-left">
                                            <span className="truncate text-sm font-medium text-foreground">
                                                {userFullName}
                                            </span>
                                            <span className="truncate text-xs text-muted-foreground">
                                                {user.email}
                                            </span>
                                        </div>
                                    </div>
                                }
                            >
                                <DropdownMenuLabel>
                                    {t("profile.title")}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    icon={<User className="h-4 w-4" />}
                                    onClick={() => {
                                        navigate(ROUTES.PROFILE);
                                        onClose();
                                    }}
                                >
                                    {t("profile.title")}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    icon={<LogOut className="h-4 w-4" />}
                                    destructive
                                    onClick={() => {
                                        logout();
                                        onClose();
                                    }}
                                >
                                    {t("auth.logoutButton")}
                                </DropdownMenuItem>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Avatar
                                    fallback="?"
                                    size="md"
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        navigate(ROUTES.LOGIN);
                                        onClose();
                                    }}
                                    className="flex-1 whitespace-normal break-words hyphens-auto h-auto min-h-[2rem] py-2"
                                    style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
                                >
                                    {t("auth.loginButton")}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
};
