import { useEffect, useRef, useState } from "react";
import type { Position } from "@/entities/position/model";
import { PositionCard } from "@/entities/position/ui";
import { DeletePositionButton } from "@/features/position-delete";
import { RestorePositionButton } from "@/features/position-restore";
import { CrudList } from "@/widgets/crudPage";
import { Button, Loader, Skeleton } from "@/shared/ui";
import { cn } from "@/shared/lib";
import { Pencil, Trash2, MoreVertical, Undo2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PositionListProps {
    positions: Position[];
    isInitialLoading: boolean;
    isLoadingMore: boolean;
    onCreateClick: () => void;
    onViewClick: (position: Position) => void;
    onEditClick: (position: Position) => void;
    onDeleted: (id: string) => void;
    observerTargetRef: (node: HTMLDivElement | null) => void;
}

const PositionCardSkeleton = () => (
    <article className="flex h-full flex-col rounded-xl border border-border/50 bg-muted/20 p-5">
        <Skeleton className="h-5 w-1/2 rounded-md" />
        <Skeleton className="mt-3 h-4 w-full rounded-md" />
        <Skeleton className="mt-2 h-4 w-2/3 rounded-md" />
        <div className="mt-auto flex gap-2 pt-4">
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-24 rounded-md" />
        </div>
    </article>
);

interface AddCardProps {
    onCreate: () => void;
    isLoading: boolean;
}

const AddCard = ({ onCreate, isLoading }: AddCardProps) => {
    const { t } = useTranslation();

    return (
        <div
            className={cn(
                "group flex h-full flex-col items-start justify-between rounded-xl border border-dashed bg-card/80 p-5 text-left transition-all hover:border-brand/80 hover:shadow-md focus-within:border-brand/80 focus-within:shadow-md",
                "border-brand/60",
                isLoading && "animate-pulse",
            )}
        >
            <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {t("positions.list.quickAction")}
                </p>
                <h2 className="text-xl font-semibold text-foreground">
                    {t("positions.list.addNew")}
                </h2>
                <p className="text-sm text-muted-foreground">
                    {t("positions.list.addNewDescription")}
                </p>
            </div>
            <Button type="button" onClick={onCreate} className="mt-6 px-6 min-h-[48px] md:min-h-0">
                {t("positions.list.createPosition")}
            </Button>
        </div>
    );
};

interface PositionActionsDropdownProps {
    position: Position;
    onEdit: (position: Position) => void;
    onDeleted: (positionId: string) => void;
}

const menuItemStyles =
    "flex w-full items-center gap-3 rounded-md px-4 py-4 md:px-3 md:py-2 text-base md:text-sm text-muted-foreground transition hover:bg-muted/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer min-h-[56px] md:min-h-0 border-b border-border/50 last:border-b-0";

const PositionActionsDropdown = ({
    position,
    onEdit,
    onDeleted,
}: PositionActionsDropdownProps) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleClick = (event: MouseEvent) => {
            const target = event.target as Node | null;
            const targetElement = target instanceof Element ? target : null;

            if (
                targetElement?.closest("[data-slot='dialog-content']") ||
                (target &&
                    (menuRef.current?.contains(target) ||
                        triggerRef.current?.contains(target)))
            ) {
                return;
            }

            setIsOpen(false);
        };

        const handleKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        window.addEventListener("mousedown", handleClick);
        window.addEventListener("keydown", handleKey);

        return () => {
            window.removeEventListener("mousedown", handleClick);
            window.removeEventListener("keydown", handleKey);
        };
    }, [isOpen]);

    const handleSelect =
        (callback: (position: Position) => void) => (selected: Position) => {
            callback(selected);
            setIsOpen(false);
        };

    const handleDeleted = () => {
        onDeleted(position.id);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <Button
                ref={triggerRef}
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8 md:h-10 md:w-10 rounded-md text-muted-foreground hover:text-foreground"
                aria-haspopup="menu"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <MoreVertical className="size-8 md:size-5" strokeWidth={2.5} />
                <span className="sr-only">{t("positions.list.actionsAlt")}</span>
            </Button>

            {isOpen ? (
                <div
                    ref={menuRef}
                    role="menu"
                    className="absolute right-0 top-full z-50 mt-2 w-[calc(100vw-2rem)] max-w-[320px] md:w-52 rounded-lg border border-border bg-popover p-2 md:p-1 shadow-lg"
                >
                    <button
                        type="button"
                        role="menuitem"
                        className={menuItemStyles}
                        onClick={() => handleSelect(onEdit)(position)}
                    >
                        <Pencil className="h-5 w-5 md:h-4 md:w-4" />
                        {t("positions.edit")}
                    </button>
                    {position.isDeleted ? (
                        <RestorePositionButton
                            id={position.id}
                            onRestored={handleDeleted}
                        >
                            <button
                                type="button"
                                role="menuitem"
                                className={menuItemStyles.concat(
                                    " text-green-600 hover:text-green-600 focus-visible:ring-green-600"
                                )}
                            >
                                <Undo2 className="h-5 w-5 md:h-4 md:w-4" />
                                {t("positions.restore")}
                            </button>
                        </RestorePositionButton>
                    ) : (
                        <DeletePositionButton
                            id={position.id}
                            navigateAfterDelete={false}
                            onDeleted={handleDeleted}
                        >
                            <button
                                type="button"
                                role="menuitem"
                                className={menuItemStyles.concat(
                                    " text-destructive hover:text-destructive focus-visible:ring-destructive"
                                )}
                            >
                                <Trash2 className="h-5 w-5 md:h-4 md:w-4" />
                                {t("positions.delete")}
                            </button>
                        </DeletePositionButton>
                    )}
                </div>
            ) : null}
        </div>
    );
};

export const PositionList = ({
    positions,
    isInitialLoading,
    isLoadingMore,
    onCreateClick,
    onViewClick,
    onEditClick,
    onDeleted,
    observerTargetRef,
}: PositionListProps) => {
    const { t } = useTranslation();
    const hasPositions = positions.length > 0;

    return (
        <div className="space-y-6">
            <CrudList className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <AddCard onCreate={onCreateClick} isLoading={isInitialLoading} />

                {isInitialLoading && (
                    <>
                        <PositionCardSkeleton />
                        <PositionCardSkeleton />
                        <PositionCardSkeleton />
                    </>
                )}

                {!isInitialLoading && hasPositions
                    ? positions.map((position) => (
                          <PositionCard
                              key={position.id}
                              position={position}
                              onNameClick={() => onViewClick(position)}
                              actions={
                                  <PositionActionsDropdown
                                      position={position}
                                      onEdit={onEditClick}
                                      onDeleted={onDeleted}
                                  />
                              }
                          />
                      ))
                    : null}
            </CrudList>
            <div ref={observerTargetRef} aria-hidden />

            {isLoadingMore ? (
                <div className="flex items-center justify-center gap-3 py-4 text-sm text-muted-foreground">
                    <Loader mode="inline" size="sm" label={t("positions.list.loadingMore")} />
                </div>
            ) : null}
        </div>
    );
};
