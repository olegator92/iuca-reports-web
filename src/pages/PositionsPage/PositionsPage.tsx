import { useEffect, useMemo, useRef, useState } from "react";
import type { Position } from "@/entities/position/model";
import { PositionDrawerForm } from "@/features/position/ui";
import { usePositionSearch } from "@/features/position-search/model";
import { usePositionFilters } from "@/features/position-filters/model";
import { PositionFilters } from "@/features/position-filters/ui";
import { Button, FormDrawer } from "@/shared/ui";
import { CrudPageLayout } from "@/widgets/crudPage";
import { usePositionList } from "@/widgets/positionList/model";
import { PositionList } from "@/widgets/positionList/ui";
import { useTranslation } from "react-i18next";

type DrawerState =
    | { type: "closed" }
    | { type: "create" }
    | { type: "position"; position: Position; mode: "view" | "edit" };

const resolveDrawerTitleKey = (state: DrawerState): string | null => {
    if (state.type === "create") {
        return "positions.drawer.createTitle";
    }

    if (state.type === "position") {
        return state.mode === "view"
            ? "positions.drawer.viewTitle"
            : "positions.drawer.editTitle";
    }

    return null;
};

export const PositionsPage = () => {
    const { search, setSearch } = usePositionSearch();
    const {
        includeDeleted,
        sortBy,
        sortDescending,
        handleIncludeDeletedChange,
        handleSortChange,
        handleResetFilters,
    } = usePositionFilters();
    const positionList = usePositionList();
    const { t } = useTranslation();

    const {
        positions,
        isInitialLoading,
        isLoadingMore,
        total,
        loadedCount,
        observerTargetRef,
        refetch,
        handlePositionCreated,
        handlePositionUpdated,
        handlePositionDeleted,
    } = positionList;

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

    const activePosition = useMemo(
        () =>
            drawerState.type === "position" ? drawerState.position : null,
        [drawerState],
    );

    const closeDrawer = () => setDrawerState({ type: "closed" });
    const openCreateDrawer = () => setDrawerState({ type: "create" });
    const openViewDrawer = (position: Position) =>
        setDrawerState({ type: "position", position, mode: "view" });
    const openEditDrawer = (position: Position) =>
        setDrawerState({ type: "position", position, mode: "edit" });

    const handleModeChange = (mode: "view" | "edit") => {
        if (drawerState.type !== "position") {
            return;
        }

        setDrawerState({
            type: "position",
            position: drawerState.position,
            mode,
        });
    };

    const handlePositionRemoved = (positionId: string) => {
        handlePositionDeleted(positionId);
        void refetch();

        if (
            drawerState.type === "position" &&
            drawerState.position.id === positionId
        ) {
            closeDrawer();
        }
    };

    return (
        <>
            <CrudPageLayout
                title={t("positions.pageTitle")}
                subtitle={t("positions.pageSubtitle")}
                quantity={{ loaded: loadedCount, total }}
                searchValue={search}
                onSearchChange={setSearch}
                onSearchClear={() => setSearch("")}
                searchPlaceholder={t("common.searchPlaceholder")}
                filtersSlot={
                    <PositionFilters
                        includeDeleted={includeDeleted}
                        sortBy={sortBy}
                        sortDescending={sortDescending}
                        onIncludeDeletedChange={handleIncludeDeletedChange}
                        onSortChange={handleSortChange}
                        onResetFilters={handleResetFilters}
                    />
                }
            >
                <PositionList
                    positions={positions}
                    isInitialLoading={isInitialLoading}
                    isLoadingMore={isLoadingMore}
                    onCreateClick={openCreateDrawer}
                    onViewClick={openViewDrawer}
                    onEditClick={openEditDrawer}
                    onDeleted={handlePositionRemoved}
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
                                form="position-form"
                                isLoading={formState.isSubmitting}
                                className="min-h-[48px] flex-1 sm:flex-initial md:min-h-0"
                            >
                                {t("positions.drawer.savePosition")}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeDrawer}
                                disabled={formState.isSubmitting}
                                className="min-h-[48px] flex-1 sm:flex-initial md:min-h-0"
                            >
                                {t("positions.cancel")}
                            </Button>
                        </div>
                    ) : undefined
                }
            >
                {renderState?.type === "create" && (
                    <PositionDrawerForm
                        mode="create"
                        onSuccess={(position) => {
                            handlePositionCreated(position);
                            closeDrawer();
                        }}
                        onCancel={closeDrawer}
                        submitLabel={t("positions.drawer.savePosition")}
                        hideFooter={true}
                        onFormStateChange={setFormState}
                    />
                )}
            </FormDrawer>

            <FormDrawer
                open={drawerState.type === "position" && !!activePosition}
                onClose={closeDrawer}
                title={currentDrawerTitle}
                description={currentDrawerDescription}
                footer={
                    renderState?.type === "position" ? (
                        <div className="flex w-full gap-2 sm:justify-end">
                            {renderState.mode === "view" ? (
                                <Button type="button" onClick={() => handleModeChange("edit")} className="min-h-[48px] flex-1 sm:flex-initial md:min-h-0">
                                    {t("positions.editMode")}
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    form="position-form"
                                    className="min-h-[48px] flex-1 sm:flex-initial md:min-h-0"
                                    disabled={!formState.hasChanges}
                                    isLoading={formState.isSubmitting}
                                >
                                    {t("positions.drawer.saveChanges")}
                                </Button>
                            )}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeDrawer}
                                disabled={formState.isSubmitting}
                                className="min-h-[48px] flex-1 sm:flex-initial md:min-h-0"
                            >
                                {renderState.mode === "view" ? t("common.close") : t("positions.cancel")}
                            </Button>
                        </div>
                    ) : undefined
                }
            >
                {renderState?.type === "position" && (
                    <PositionDrawerForm
                        mode={renderState.mode}
                        position={renderState.position}
                        onModeChange={handleModeChange}
                        onSuccess={(position) => {
                            handlePositionUpdated(position);
                            closeDrawer();
                        }}
                        onCancel={closeDrawer}
                        submitLabel={t("positions.drawer.saveChanges")}
                        hideFooter={true}
                        onFormStateChange={setFormState}
                    />
                )}
            </FormDrawer>
        </>
    );
};
