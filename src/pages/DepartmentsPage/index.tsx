import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Department } from "@/entities/department/model";
import { DepartmentDrawerForm } from "@/features/department";
import { useDepartmentSearch } from "@/features/department-search";
import { useDepartmentFilters } from "@/features/department-filters";
import { DepartmentFilters } from "@/features/department-filters";
import { Button, FormDrawer, ProtectedContent, Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui";
import { CrudPageLayout } from "@/widgets/crudPage";
import { useDepartmentList } from "@/widgets/departmentList";
import { DepartmentListWidget } from "@/widgets/departmentList";
import { DepartmentHierarchyWidget } from "@/widgets/departmentHierarchy";
import { PERMISSIONS } from "@/shared/lib";
import { Building2 } from "lucide-react";

type DrawerState =
    | { type: "closed" }
    | { type: "create"; defaultParentDepartmentId?: string | null }
    | { type: "department"; department: Department; mode: "view" | "edit" };

const resolveDrawerTitleKey = (state: DrawerState): string | null => {
    if (state.type === "create") return "departments.createTitle";
    if (state.type === "department") {
        return state.mode === "view" ? "departments.viewTitle" : "departments.editTitle";
    }
    return null;
};

export const DepartmentsPage = () => {
    const { t } = useTranslation();
    const { search, setSearch } = useDepartmentSearch();
    const {
        includeDeleted,
        sortBy,
        sortDescending,
        handleIncludeDeletedChange,
        handleSortChange,
        handleResetFilters,
    } = useDepartmentFilters();

    const departmentList = useDepartmentList();
    const {
        departments,
        isInitialLoading,
        isLoadingMore,
        total,
        loadedCount,
        observerTargetRef,
        refetch,
        handleDepartmentCreated,
        handleDepartmentUpdated,
    } = departmentList;

    const [drawerState, setDrawerState] = useState<DrawerState>({ type: "closed" });
    const lastOpenStateRef = useRef<DrawerState | null>(null);

    useEffect(() => {
        if (drawerState.type !== "closed") {
            lastOpenStateRef.current = drawerState;
        }
    }, [drawerState]);

    const renderState = drawerState.type !== "closed" ? drawerState : lastOpenStateRef.current;

    const [formState, setFormState] = useState<{ isSubmitting: boolean; hasChanges: boolean }>({
        isSubmitting: false,
        hasChanges: false,
    });

    const currentDrawerTitleKey = resolveDrawerTitleKey(drawerState);
    const currentDrawerTitle = currentDrawerTitleKey ? t(currentDrawerTitleKey) : "";

    const activeDepartment = useMemo(
        () => (drawerState.type === "department" ? drawerState.department : null),
        [drawerState],
    );

    const closeDrawer = () => setDrawerState({ type: "closed" });
    const openCreateDrawer = (defaultParentDepartmentId?: string | null) =>
        setDrawerState({ type: "create", defaultParentDepartmentId });
    const openViewDrawer = (department: Department) =>
        setDrawerState({ type: "department", department, mode: "view" });
    const openEditDrawer = (department: Department) =>
        setDrawerState({ type: "department", department, mode: "edit" });

    const handleModeChange = (mode: "view" | "edit") => {
        if (drawerState.type !== "department") return;
        setDrawerState({ type: "department", department: drawerState.department, mode });
    };

    const handleMutated = () => {
        void refetch();
    };

    return (
        <>
            <CrudPageLayout
                title={t("departments.pageTitle")}
                quantity={{ loaded: loadedCount, total }}
                searchValue={search}
                onSearchChange={setSearch}
                onSearchClear={() => setSearch("")}
                searchPlaceholder={t("common.searchPlaceholder")}
                filtersSlot={
                    <DepartmentFilters
                        includeDeleted={includeDeleted}
                        sortBy={sortBy}
                        sortDescending={sortDescending}
                        onIncludeDeletedChange={handleIncludeDeletedChange}
                        onSortChange={handleSortChange}
                        onResetFilters={handleResetFilters}
                    />
                }
            >
                <Tabs defaultValue="list">
                    <TabsList className="mb-4">
                        <TabsTrigger value="list">{t("departments.listView")}</TabsTrigger>
                        <TabsTrigger value="tree">{t("departments.treeView")}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="list">
                        <DepartmentListWidget
                            departments={departments}
                            isInitialLoading={isInitialLoading}
                            isLoadingMore={isLoadingMore}
                            onCreateClick={() => openCreateDrawer()}
                            onAddChildClick={(parentId) => openCreateDrawer(parentId)}
                            onViewClick={openViewDrawer}
                            onEditClick={openEditDrawer}
                            onMutated={handleMutated}
                            observerTargetRef={observerTargetRef}
                        />
                    </TabsContent>
                    <TabsContent value="tree">
                        <div className="space-y-4">
                            <ProtectedContent requiredPermissions={[PERMISSIONS.DEPARTMENT_EDIT]}>
                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        onClick={() => openCreateDrawer()}
                                        className="min-h-[48px] md:min-h-0"
                                    >
                                        <Building2 className="h-4 w-4" />
                                        <span className="ml-2">{t("departments.addButton")}</span>
                                    </Button>
                                </div>
                            </ProtectedContent>
                            <DepartmentHierarchyWidget
                                onView={openViewDrawer}
                                onEdit={openEditDrawer}
                                onAddChild={(parentId) => openCreateDrawer(parentId)}
                                onMutated={handleMutated}
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </CrudPageLayout>

            {/* Create Drawer */}
            <FormDrawer
                open={drawerState.type === "create"}
                onClose={closeDrawer}
                title={currentDrawerTitle}
                description=""
                footer={
                    renderState?.type === "create" ? (
                        <div className="flex w-full gap-2 sm:justify-end">
                            <Button
                                type="submit"
                                form="department-form"
                                isLoading={formState.isSubmitting}
                                className="min-h-[48px] flex-1 sm:flex-initial md:min-h-0"
                            >
                                {t("departments.createTitle")}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeDrawer}
                                disabled={formState.isSubmitting}
                                className="min-h-[48px] flex-1 sm:flex-initial md:min-h-0"
                            >
                                {t("common.cancel")}
                            </Button>
                        </div>
                    ) : undefined
                }
            >
                {renderState?.type === "create" && (
                    <DepartmentDrawerForm
                        mode="create"
                        defaultParentDepartmentId={renderState.defaultParentDepartmentId}
                        onSuccess={(department) => {
                            handleDepartmentCreated(department);
                            closeDrawer();
                        }}
                        onCancel={closeDrawer}
                        submitLabel={t("departments.createTitle")}
                        hideFooter={true}
                        onFormStateChange={setFormState}
                    />
                )}
            </FormDrawer>

            {/* View/Edit Drawer */}
            <FormDrawer
                open={drawerState.type === "department" && !!activeDepartment}
                onClose={closeDrawer}
                title={currentDrawerTitle}
                description=""
                footer={
                    renderState?.type === "department" ? (
                        <div className="flex w-full gap-2 sm:justify-end">
                            {renderState.mode === "view" ? (
                                <ProtectedContent requiredPermissions={[PERMISSIONS.DEPARTMENT_EDIT]}>
                                    <Button
                                        type="button"
                                        onClick={() => handleModeChange("edit")}
                                        className="min-h-[48px] flex-1 sm:flex-initial md:min-h-0"
                                    >
                                        {t("common.edit")}
                                    </Button>
                                </ProtectedContent>
                            ) : (
                                <Button
                                    type="submit"
                                    form="department-form"
                                    className="min-h-[48px] flex-1 sm:flex-initial md:min-h-0"
                                    disabled={!formState.hasChanges}
                                    isLoading={formState.isSubmitting}
                                >
                                    {t("common.save")}
                                </Button>
                            )}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeDrawer}
                                disabled={formState.isSubmitting}
                                className="min-h-[48px] flex-1 sm:flex-initial md:min-h-0"
                            >
                                {renderState.mode === "view" ? t("common.close") : t("common.cancel")}
                            </Button>
                        </div>
                    ) : undefined
                }
            >
                {renderState?.type === "department" && (
                    <DepartmentDrawerForm
                        mode={renderState.mode}
                        department={renderState.department}
                        onModeChange={handleModeChange}
                        onSuccess={(department) => {
                            handleDepartmentUpdated(department);
                            closeDrawer();
                        }}
                        onCancel={closeDrawer}
                        hideFooter={true}
                        onFormStateChange={setFormState}
                    />
                )}
            </FormDrawer>
        </>
    );
};
