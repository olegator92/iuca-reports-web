import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Role } from "@/entities/role";
import { RoleDrawerForm } from "@/features/role";
import { Button, FormDrawer } from "@/shared/ui";
import { CrudPageLayout } from "@/widgets/crudPage";
import { useRoleList } from "@/widgets/roleList/model";
import { RoleList } from "@/widgets/roleList/ui";

type DrawerState =
    | { type: "closed" }
    | { type: "create" }
    | { type: "role"; role: Role; mode: "view" | "edit" };

const resolveDrawerTitleKey = (state: DrawerState): string | null => {
    if (state.type === "create") {
        return "roles.drawer.createTitle";
    }

    if (state.type === "role") {
        return state.mode === "view"
            ? "roles.drawer.viewTitle"
            : "roles.drawer.editTitle";
    }

    return null;
};

export const RolesPage = () => {
    const { t } = useTranslation();
    const roleList = useRoleList();

    const {
        roles,
        isInitialLoading,
        total,
        loadedCount,
        refetch,
        handleRoleCreated,
        handleRoleUpdated,
        handleRoleDeleted
    } = roleList;

    const [drawerState, setDrawerState] = useState<DrawerState>({
        type: "closed"
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

    const isDrawerOpen = drawerState.type !== "closed";
    const currentDrawerTitleKey = resolveDrawerTitleKey(drawerState);
    const currentDrawerTitle = currentDrawerTitleKey
        ? t(currentDrawerTitleKey)
        : "";
    const currentDrawerDescription = "";

    const activeRole = useMemo(
        () => (drawerState.type === "role" ? drawerState.role : null),
        [drawerState]
    );

    const closeDrawer = () => setDrawerState({ type: "closed" });
    const openCreateDrawer = () => setDrawerState({ type: "create" });
    const openViewDrawer = (role: Role) =>
        setDrawerState({ type: "role", role, mode: "view" });
    const openEditDrawer = (role: Role) =>
        setDrawerState({ type: "role", role, mode: "edit" });

    const handleModeChange = (mode: "view" | "edit") => {
        if (drawerState.type !== "role") {
            return;
        }

        // Prevent editing system roles
        if (drawerState.role.isSystemRole && mode === "edit") {
            return;
        }

        setDrawerState({
            type: "role",
            role: drawerState.role,
            mode
        });
    };

    const handleCloseOrReset = () => {
        if (drawerState.type === "role" && drawerState.mode === "edit") {
            setDrawerState({
                type: "role",
                role: drawerState.role,
                mode: "view"
            });
            return;
        }

        closeDrawer();
    };

    const handleRoleRemoved = (roleId: string) => {
        handleRoleDeleted(roleId);
        void refetch();

        if (
            drawerState.type === "role" &&
            drawerState.role.id === roleId
        ) {
            closeDrawer();
        }
    };

    return (
        <>
            <CrudPageLayout
                title={t("roles.pageTitle")}
                subtitle={t("roles.pageSubtitle")}
                quantity={{ loaded: loadedCount, total }}
            >
                <RoleList
                    roles={roles}
                    isInitialLoading={isInitialLoading}
                    onCreateClick={openCreateDrawer}
                    onViewClick={openViewDrawer}
                    onEditClick={openEditDrawer}
                    onDeleted={handleRoleRemoved}
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
                            <Button type="submit" form="role-form" isLoading={formState.isSubmitting} className="min-h-[48px] flex-1 sm:flex-initial md:min-h-0">
                                {t("roles.drawer.saveRole")}
                            </Button>
                            <Button type="button" variant="outline" onClick={closeDrawer} disabled={formState.isSubmitting} className="min-h-[48px] flex-1 sm:flex-initial md:min-h-0">
                                {t("roleForm.cancel")}
                            </Button>
                        </div>
                    ) : undefined
                }
            >
                {renderState?.type === "create" && (
                    <RoleDrawerForm
                        mode="create"
                        onSuccess={(role) => {
                            handleRoleCreated(role);
                            closeDrawer();
                        }}
                        onCancel={closeDrawer}
                        submitLabel={t("roles.drawer.saveRole")}
                        hideFooter={true}
                        onFormStateChange={setFormState}
                    />
                )}
            </FormDrawer>

            <FormDrawer
                open={drawerState.type === "role" && !!activeRole}
                onClose={closeDrawer}
                title={currentDrawerTitle}
                description={currentDrawerDescription}
                footer={
                    renderState?.type === "role" ? (
                        <div className="flex w-full gap-2 sm:justify-end">
                            {renderState.mode === "view" ? (
                                !renderState.role.isSystemRole && (
                                    <Button type="button" onClick={() => handleModeChange("edit")} className="min-h-[48px] flex-1 sm:flex-initial md:min-h-0">
                                        {t("roleForm.editMode")}
                                    </Button>
                                )
                            ) : (
                                <Button
                                    type="submit"
                                    form="role-form"
                                    className="min-h-[48px] flex-1 sm:flex-initial md:min-h-0"
                                    disabled={!formState.hasChanges}
                                    isLoading={formState.isSubmitting}
                                >
                                    {t("roles.drawer.saveChanges")}
                                </Button>
                            )}
                            <Button type="button" variant="outline" onClick={closeDrawer} disabled={formState.isSubmitting} className="min-h-[48px] flex-1 sm:flex-initial md:min-h-0">
                                {renderState.mode === "view" ? t("common.close") : t("roleForm.cancel")}
                            </Button>
                        </div>
                    ) : undefined
                }
            >
                {renderState?.type === "role" && (
                    <RoleDrawerForm
                        mode={renderState.mode}
                        role={renderState.role}
                        onModeChange={handleModeChange}
                        onSuccess={(role) => {
                            handleRoleUpdated(role);
                            closeDrawer();
                        }}
                        onCancel={handleCloseOrReset}
                        submitLabel={t("roles.drawer.saveChanges")}
                        hideFooter={true}
                        onFormStateChange={setFormState}
                    />
                )}
            </FormDrawer>
        </>
    );
};
