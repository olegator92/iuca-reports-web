import { useEffect, useMemo, useRef, useState } from "react";
import type { User } from "@/entities/user/model";
import { useGetUserByIdQuery } from "@/entities/user/api";
import { UserDrawerForm } from "@/features/user/ui";
import { useUserSearch } from "@/features/user-search/model";
import { useUserFilters } from "@/features/user-filters/model";
import { UserFilters } from "@/features/user-filters/ui";
import { UserRolesManager } from "@/features/user-roles/ui";
import { Button, FormDrawer } from "@/shared/ui";
import { CrudPageLayout } from "@/widgets/crudPage";
import { useUserList } from "@/widgets/userList/model";
import { UserList } from "@/widgets/userList/ui";
import { useTranslation } from "react-i18next";

type DrawerState =
    | { type: "closed" }
    | { type: "create" }
    | { type: "user"; user: User; mode: "view" | "edit" }
    | { type: "roles"; user: User };

const resolveDrawerTitleKey = (state: DrawerState): string | null => {
    if (state.type === "create") {
        return "users.drawer.createTitle";
    }

    if (state.type === "user") {
        return state.mode === "view"
            ? "users.drawer.viewTitle"
            : "users.drawer.editTitle";
    }

    if (state.type === "roles") {
        return "users.drawer.rolesTitle";
    }

    return null;
};

export const UsersPage = () => {
    const { search, setSearch } = useUserSearch();
    const {
        filterIsActive,
        filterRoleName,
        sortBy,
        sortDescending,
        handleFilterIsActiveChange,
        handleFilterRoleNameChange,
        handleSortChange,
        handleResetFilters,
    } = useUserFilters();
    const userList = useUserList();
    const { t } = useTranslation();

    const {
        users,
        isInitialLoading,
        isLoadingMore,
        total,
        loadedCount,
        observerTargetRef,
        refetch,
        handleUserCreated,
        handleUserUpdated,
        handleUserDeleted,
    } = userList;

    const [drawerState, setDrawerState] = useState<DrawerState>({
        type: "closed",
    });

    // Track last open state for closing animation
    const lastOpenStateRef = useRef<DrawerState | null>(null);
    useEffect(() => {
        if (drawerState.type !== "closed") {
            lastOpenStateRef.current = drawerState;
        }
    }, [drawerState]);

    // Use last open state during close animation
    const renderState = drawerState.type !== "closed" ? drawerState : lastOpenStateRef.current;

    const [formState, setFormState] = useState<{
        isSubmitting: boolean;
        hasChanges: boolean;
    }>({
        isSubmitting: false,
        hasChanges: false,
    });

    // Get the current user ID for fresh data fetching
    const currentUserId = useMemo(
        () => {
            if (drawerState.type === "user") return drawerState.user.id;
            if (drawerState.type === "roles") return drawerState.user.id;
            return null;
        },
        [drawerState]
    );

    // Fetch fresh user data when drawer is open
    const { data: freshUserData } = useGetUserByIdQuery(currentUserId ?? "", {
        skip: !currentUserId
    });

    const isDrawerOpen = drawerState.type !== "closed";
    const currentDrawerTitleKey = resolveDrawerTitleKey(drawerState);
    const currentDrawerTitle = currentDrawerTitleKey
        ? t(currentDrawerTitleKey)
        : "";
    const currentDrawerDescription = "";

    // Use fresh data when available, fallback to drawer state data
    const activeUser = useMemo(
        () => {
            if (drawerState.type !== "user") return null;
            return freshUserData ?? drawerState.user;
        },
        [drawerState, freshUserData],
    );

    const closeDrawer = () => setDrawerState({ type: "closed" });
    const openCreateDrawer = () => setDrawerState({ type: "create" });
    const openViewDrawer = (user: User) =>
        setDrawerState({ type: "user", user, mode: "view" });
    const openEditDrawer = (user: User) =>
        setDrawerState({ type: "user", user, mode: "edit" });
    const openRolesDrawer = (user: User) =>
        setDrawerState({ type: "roles", user });

    const handleModeChange = (mode: "view" | "edit") => {
        if (drawerState.type !== "user") {
            return;
        }

        setDrawerState({
            type: "user",
            user: drawerState.user,
            mode,
        });
    };

    const handleCloseOrReset = () => {
        if (drawerState.type === "user" && drawerState.mode === "edit") {
            setDrawerState({
                type: "user",
                user: drawerState.user,
                mode: "view",
            });
            return;
        }

        closeDrawer();
    };

    const handleUserRemoved = (userId: string) => {
        handleUserDeleted(userId);
        void refetch();

        if (
            drawerState.type === "user" &&
            drawerState.user.id === userId
        ) {
            closeDrawer();
        }
    };

    const handleRolesChanged = (updatedUser: User) => {
        handleUserUpdated(updatedUser);
    };

    return (
        <>
            <CrudPageLayout
                title={t("users.pageTitle")}
                subtitle={t("users.pageSubtitle")}
                quantity={{ loaded: loadedCount, total }}
                searchValue={search}
                onSearchChange={setSearch}
                onSearchClear={() => setSearch("")}
                searchPlaceholder={t("common.searchPlaceholder")}
                filtersSlot={
                    <UserFilters
                        filterIsActive={filterIsActive}
                        filterRoleName={filterRoleName}
                        sortBy={sortBy}
                        sortDescending={sortDescending}
                        onFilterIsActiveChange={handleFilterIsActiveChange}
                        onFilterRoleNameChange={handleFilterRoleNameChange}
                        onSortChange={handleSortChange}
                        onResetFilters={handleResetFilters}
                    />
                }
            >
                <UserList
                    users={users}
                    isInitialLoading={isInitialLoading}
                    isLoadingMore={isLoadingMore}
                    onCreateClick={openCreateDrawer}
                    onViewClick={openViewDrawer}
                    onEditClick={openEditDrawer}
                    onManageRoles={openRolesDrawer}
                    onDeleted={handleUserRemoved}
                    onStatusChange={handleUserUpdated}
                    observerTargetRef={observerTargetRef}
                />
            </CrudPageLayout>

            <FormDrawer
                open={drawerState.type === "create"}
                onClose={closeDrawer}
                title={currentDrawerTitle}
                description={currentDrawerDescription}
                footer={
                    renderState?.type === "create" ? (
                        <div className="flex w-full gap-2 sm:justify-end">
                            <Button type="submit" form="user-form" isLoading={formState.isSubmitting} className="min-h-[48px] flex-1 sm:flex-initial md:min-h-0">
                                {t("users.drawer.saveUser")}
                            </Button>
                            <Button type="button" variant="outline" onClick={closeDrawer} disabled={formState.isSubmitting} className="min-h-[48px] flex-1 sm:flex-initial md:min-h-0">
                                {t("userForm.cancel")}
                            </Button>
                        </div>
                    ) : undefined
                }
            >
                {renderState?.type === "create" && (
                    <UserDrawerForm
                        mode="create"
                        onSuccess={(user) => {
                            handleUserCreated(user);
                            closeDrawer();
                        }}
                        onCancel={closeDrawer}
                        submitLabel={t("users.drawer.saveUser")}
                        hideFooter={true}
                        onFormStateChange={setFormState}
                    />
                )}
            </FormDrawer>

            <FormDrawer
                open={drawerState.type === "user" && !!activeUser}
                onClose={closeDrawer}
                title={currentDrawerTitle}
                description={currentDrawerDescription}
                footer={
                    renderState?.type === "user" ? (
                        <div className="flex w-full gap-2 sm:justify-end">
                            {renderState.mode === "view" ? (
                                <Button type="button" onClick={() => handleModeChange("edit")} className="min-h-[48px] flex-1 sm:flex-initial md:min-h-0">
                                    {t("userForm.editMode")}
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    form="user-form"
                                    className="min-h-[48px] flex-1 sm:flex-initial md:min-h-0"
                                    disabled={!formState.hasChanges}
                                    isLoading={formState.isSubmitting}
                                >
                                    {t("users.drawer.saveChanges")}
                                </Button>
                            )}
                            <Button type="button" variant="outline" onClick={closeDrawer} disabled={formState.isSubmitting} className="min-h-[48px] flex-1 sm:flex-initial md:min-h-0">
                                {renderState.mode === "view" ? t("common.close") : t("userForm.cancel")}
                            </Button>
                        </div>
                    ) : undefined
                }
            >
                {renderState?.type === "user" && (
                    <UserDrawerForm
                        mode={renderState.mode}
                        user={renderState.user}
                        onModeChange={handleModeChange}
                        onSuccess={(user) => {
                            handleUserUpdated(user);
                            closeDrawer();
                        }}
                        onCancel={handleCloseOrReset}
                        submitLabel={t("users.drawer.saveChanges")}
                        hideFooter={true}
                        onFormStateChange={setFormState}
                    />
                )}
            </FormDrawer>

            <FormDrawer
                open={drawerState.type === "roles" && !!freshUserData}
                onClose={closeDrawer}
                title={currentDrawerTitle}
                description={currentDrawerDescription}
            >
                {renderState?.type === "roles" && freshUserData && (
                    <UserRolesManager
                        user={freshUserData}
                        onRolesChanged={handleRolesChanged}
                    />
                )}
            </FormDrawer>
        </>
    );
};
