import { useEffect, useMemo, useRef, useState } from "react";
import type { Template } from "@/entities/template/model";
import { TemplateDrawerForm } from "@/features/template/ui";
import { useTemplateSearch } from "@/features/template-search/model";
import { useTemplateFilters } from "@/features/template-filters/model";
import { TemplateFilters } from "@/features/template-filters/ui";
import { Button, FormDrawer } from "@/shared/ui";
import { CrudPageLayout } from "@/widgets/crudPage";
import { useTemplateList } from "@/widgets/templateList/model";
import { TemplateList } from "@/widgets/templateList/ui";
import { useTranslation } from "react-i18next";

type DrawerState =
    | { type: "closed" }
    | { type: "create" }
    | { type: "template"; template: Template; mode: "view" | "edit" };

const resolveDrawerTitleKey = (state: DrawerState): string | null => {
    if (state.type === "create") {
        return "templates.drawer.createTitle";
    }

    if (state.type === "template") {
        return state.mode === "view"
            ? "templates.drawer.viewTitle"
            : "templates.drawer.editTitle";
    }

    return null;
};

export const TemplatesPage = () => {
    const { search, setSearch } = useTemplateSearch();
    const {
        includeDeleted,
        sortBy,
        sortDescending,
        handleIncludeDeletedChange,
        handleSortChange,
        handleResetFilters,
    } = useTemplateFilters();
    const templateList = useTemplateList();
    const { t } = useTranslation();

    const {
        templates,
        isInitialLoading,
        isLoadingMore,
        total,
        loadedCount,
        observerTargetRef,
        refetch,
        handleTemplateCreated,
        handleTemplateUpdated,
        handleTemplateDeleted,
    } = templateList;

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

    const isDrawerOpen = drawerState.type !== "closed";
    const currentDrawerTitleKey = resolveDrawerTitleKey(drawerState);
    const currentDrawerTitle = currentDrawerTitleKey
        ? t(currentDrawerTitleKey)
        : "";
    const currentDrawerDescription = "";

    const activeTemplate = useMemo(
        () =>
            drawerState.type === "template" ? drawerState.template : null,
        [drawerState],
    );

    const closeDrawer = () => setDrawerState({ type: "closed" });
    const openCreateDrawer = () => setDrawerState({ type: "create" });
    const openViewDrawer = (template: Template) =>
        setDrawerState({ type: "template", template, mode: "view" });
    const openEditDrawer = (template: Template) =>
        setDrawerState({ type: "template", template, mode: "edit" });

    const handleModeChange = (mode: "view" | "edit") => {
        if (drawerState.type !== "template") {
            return;
        }

        setDrawerState({
            type: "template",
            template: drawerState.template,
            mode,
        });
    };

    const handleTemplateRemoved = (templateId: string) => {
        handleTemplateDeleted(templateId);
        void refetch();

        if (
            drawerState.type === "template" &&
            drawerState.template.id === templateId
        ) {
            closeDrawer();
        }
    };

    return (
        <>
            <CrudPageLayout
                title={t("templates.pageTitle")}
                subtitle={t("templates.pageSubtitle")}
                quantity={{ loaded: loadedCount, total }}
                searchValue={search}
                onSearchChange={setSearch}
                onSearchClear={() => setSearch("")}
                searchPlaceholder={t("common.searchPlaceholder")}
                filtersSlot={
                    <TemplateFilters
                        includeDeleted={includeDeleted}
                        sortBy={sortBy}
                        sortDescending={sortDescending}
                        onIncludeDeletedChange={handleIncludeDeletedChange}
                        onSortChange={handleSortChange}
                        onResetFilters={handleResetFilters}
                    />
                }
            >
                <TemplateList
                    templates={templates}
                    isInitialLoading={isInitialLoading}
                    isLoadingMore={isLoadingMore}
                    onCreateClick={openCreateDrawer}
                    onViewClick={openViewDrawer}
                    onEditClick={openEditDrawer}
                    onDeleted={handleTemplateRemoved}
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
                            <Button
                                type="submit"
                                form="template-form"
                                isLoading={formState.isSubmitting}
                                className="min-h-[48px] flex-1 sm:flex-initial md:min-h-0"
                            >
                                {t("templates.drawer.saveTemplate")}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeDrawer}
                                disabled={formState.isSubmitting}
                                className="min-h-[48px] flex-1 sm:flex-initial md:min-h-0"
                            >
                                {t("templateForm.cancel")}
                            </Button>
                        </div>
                    ) : undefined
                }
            >
                {renderState?.type === "create" && (
                    <TemplateDrawerForm
                        mode="create"
                        onSuccess={(template) => {
                            handleTemplateCreated(template);
                            closeDrawer();
                        }}
                        onCancel={closeDrawer}
                        submitLabel={t("templates.drawer.saveTemplate")}
                        hideFooter={true}
                        onFormStateChange={setFormState}
                    />
                )}
            </FormDrawer>

            <FormDrawer
                open={drawerState.type === "template" && !!activeTemplate}
                onClose={closeDrawer}
                title={currentDrawerTitle}
                description={currentDrawerDescription}
                footer={
                    renderState?.type === "template" ? (
                        <div className="flex w-full gap-2 sm:justify-end">
                            {renderState.mode === "view" ? (
                                <Button type="button" onClick={() => handleModeChange("edit")} className="min-h-[48px] flex-1 sm:flex-initial md:min-h-0">
                                    {t("templateForm.editMode")}
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    form="template-form"
                                    className="min-h-[48px] flex-1 sm:flex-initial md:min-h-0"
                                    disabled={!formState.hasChanges}
                                    isLoading={formState.isSubmitting}
                                >
                                    {t("templates.drawer.saveChanges")}
                                </Button>
                            )}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeDrawer}
                                disabled={formState.isSubmitting}
                                className="min-h-[48px] flex-1 sm:flex-initial md:min-h-0"
                            >
                                {renderState.mode === "view" ? t("common.close") : t("templateForm.cancel")}
                            </Button>
                        </div>
                    ) : undefined
                }
            >
                {renderState?.type === "template" && (
                    <TemplateDrawerForm
                        mode={renderState.mode}
                        template={renderState.template}
                        onModeChange={handleModeChange}
                        onSuccess={(template) => {
                            handleTemplateUpdated(template);
                            closeDrawer();
                        }}
                        onCancel={closeDrawer}
                        submitLabel={t("templates.drawer.saveChanges")}
                        hideFooter={true}
                        onFormStateChange={setFormState}
                    />
                )}
            </FormDrawer>
        </>
    );
};
