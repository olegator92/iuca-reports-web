import { useEffect, useRef, useState } from "react";
import type { User } from "@/entities/user/api";
import { UserCard } from "@/entities/user/ui";
import { DeleteUserButton } from "@/features/user-delete/ui/DeleteUserButton";
import { CrudList } from "@/widgets/crudPage";
import { Button, Loader, Skeleton } from "@/shared/ui";
import { cn } from "@/shared/lib";
import { Pencil, Trash2, MoreVertical, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

interface UserListProps {
    users: User[];
    isInitialLoading: boolean;
    isLoadingMore: boolean;
    onCreateClick: () => void;
    onViewClick: (user: User) => void;
    onEditClick: (user: User) => void;
    onManageRoles: (user: User) => void;
    onDeleted: (id: string) => void;
    onStatusChange?: (user: User) => void;
    observerTargetRef: (node: HTMLDivElement | null) => void;
}

const UserCardSkeleton = () => (
    <article className="flex h-full flex-col rounded-xl border border-border/50 bg-muted/20 p-5">
        <div className="flex items-start gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32 rounded-md" />
                <Skeleton className="h-4 w-48 rounded-md" />
                <div className="flex gap-1.5">
                    <Skeleton className="h-5 w-16 rounded-md" />
                    <Skeleton className="h-5 w-16 rounded-md" />
                </div>
            </div>
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
                    {t("users.list.quickAction")}
                </p>
                <h2 className="text-xl font-semibold text-foreground">
                    {t("users.list.addNew")}
                </h2>
                <p className="text-sm text-muted-foreground">
                    {t("users.list.addNewDescription")}
                </p>
            </div>
            <Button type="button" onClick={onCreate} className="mt-6 px-6 min-h-[48px] md:min-h-0">
                {t("users.list.createUser")}
            </Button>
        </div>
    );
};

interface UserActionsDropdownProps {
    user: User;
    onEdit: (user: User) => void;
    onManageRoles: (user: User) => void;
    onDeleted: (userId: string) => void;
}

const menuItemStyles =
    "flex w-full items-center gap-3 rounded-md px-4 py-4 md:px-3 md:py-2 text-base md:text-sm text-muted-foreground transition hover:bg-muted/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer min-h-[56px] md:min-h-0 border-b border-border/50 last:border-b-0";

const UserActionsDropdown = ({
    user,
    onEdit,
    onManageRoles,
    onDeleted,
}: UserActionsDropdownProps) => {
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
        (callback: (user: User) => void) => (selected: User) => {
            callback(selected);
            setIsOpen(false);
        };

    const handleDeleted = () => {
        onDeleted(user.id);
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
                <span className="sr-only">{t("users.list.actionsAlt")}</span>
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
                        onClick={() => handleSelect(onEdit)(user)}
                    >
                        <Pencil className="h-5 w-5 md:h-4 md:w-4" />
                        {t("common.edit")}
                    </button>
                    <button
                        type="button"
                        role="menuitem"
                        className={menuItemStyles}
                        onClick={() => handleSelect(onManageRoles)(user)}
                    >
                        <Shield className="h-5 w-5 md:h-4 md:w-4" />
                        {t("users.list.manageRoles")}
                    </button>
                    <DeleteUserButton
                        id={user.id}
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
                            {t("common.delete")}
                        </button>
                    </DeleteUserButton>
                </div>
            ) : null}
        </div>
    );
};

export const UserList = ({
    users,
    isInitialLoading,
    isLoadingMore,
    onCreateClick,
    onViewClick,
    onEditClick,
    onManageRoles,
    onDeleted,
    onStatusChange,
    observerTargetRef,
}: UserListProps) => {
    const { t } = useTranslation();
    const hasUsers = users.length > 0;

    return (
        <div className="space-y-6">
            <CrudList>
                <AddCard onCreate={onCreateClick} isLoading={isInitialLoading} />

                {isInitialLoading && (
                    <>
                        <UserCardSkeleton />
                        <UserCardSkeleton />
                        <UserCardSkeleton />
                    </>
                )}

                {!isInitialLoading && hasUsers
                    ? users.map((user) => (
                          <UserCard
                              key={user.id}
                              user={user}
                              onNameClick={() => onViewClick(user)}
                              onStatusChange={() => onStatusChange?.({ ...user, isActive: !user.isActive })}
                              actions={
                                  <UserActionsDropdown
                                      user={user}
                                      onEdit={onEditClick}
                                      onManageRoles={onManageRoles}
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
                    <Loader mode="inline" size="sm" label={t("common.loadingMore")} />
                </div>
            ) : null}
        </div>
    );
};
