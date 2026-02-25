import { useEffect, useRef, useState } from "react";
import type { Department } from "@/entities/department/model";
import { DepartmentDeleteButton } from "@/features/department-delete";
import { DepartmentRestoreButton } from "@/features/department-restore";
import { CrudList } from "@/widgets/crudPage";
import { Badge, Button, Loader, ProtectedContent, Skeleton } from "@/shared/ui";
import { cn } from "@/shared/lib";
import { Building2, FolderPlus, MoreVertical, Pencil, Trash2, Undo2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PERMISSIONS } from "@/shared/lib";

const DepartmentCardSkeleton = () => (
    <article className="flex h-full flex-col rounded-xl border border-border/50 bg-muted/20 p-5">
        <Skeleton className="h-5 w-1/2 rounded-md" />
        <Skeleton className="mt-3 h-4 w-full rounded-md" />
        <Skeleton className="mt-2 h-4 w-2/3 rounded-md" />
    </article>
);

const menuItemStyles =
    "flex w-full items-center gap-3 rounded-md px-4 py-4 md:px-3 md:py-2 text-base md:text-sm text-muted-foreground transition hover:bg-muted/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer min-h-[56px] md:min-h-0 border-b border-border/50 last:border-b-0";

interface DepartmentActionsDropdownProps {
    department: Department;
    onEdit: (department: Department) => void;
    onView: (department: Department) => void;
    onAddChild: (parentId: string) => void;
    onMutated: () => void;
}

const DepartmentActionsDropdown = ({
    department,
    onEdit,
    onView,
    onAddChild,
    onMutated,
}: DepartmentActionsDropdownProps) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!isOpen) return;

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
            if (event.key === "Escape") setIsOpen(false);
        };

        window.addEventListener("mousedown", handleClick);
        window.addEventListener("keydown", handleKey);
        return () => {
            window.removeEventListener("mousedown", handleClick);
            window.removeEventListener("keydown", handleKey);
        };
    }, [isOpen]);

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
                <span className="sr-only">{t("common.actions")}</span>
            </Button>

            {isOpen && (
                <div
                    ref={menuRef}
                    role="menu"
                    className="absolute right-0 top-full z-50 mt-2 w-[calc(100vw-2rem)] max-w-[320px] md:w-52 rounded-lg border border-border bg-popover p-2 md:p-1 shadow-lg"
                >
                    <button
                        type="button"
                        role="menuitem"
                        className={menuItemStyles}
                        onClick={() => { onView(department); setIsOpen(false); }}
                    >
                        <Building2 className="h-5 w-5 md:h-4 md:w-4" />
                        {t("common.view")}
                    </button>
                    <ProtectedContent requiredPermissions={[PERMISSIONS.DEPARTMENT_EDIT]}>
                        <button
                            type="button"
                            role="menuitem"
                            className={menuItemStyles}
                            onClick={() => { onEdit(department); setIsOpen(false); }}
                        >
                            <Pencil className="h-5 w-5 md:h-4 md:w-4" />
                            {t("common.edit")}
                        </button>
                        <button
                            type="button"
                            role="menuitem"
                            className={menuItemStyles}
                            onClick={() => { onAddChild(department.id); setIsOpen(false); }}
                        >
                            <FolderPlus className="h-5 w-5 md:h-4 md:w-4" />
                            {t("departments.addChild")}
                        </button>
                        {department.isDeleted ? (
                            <DepartmentRestoreButton
                                id={department.id}
                                name={department.name}
                                onRestored={() => { onMutated(); setIsOpen(false); }}
                            >
                                <button
                                    type="button"
                                    role="menuitem"
                                    className={menuItemStyles.concat(" text-green-600 hover:text-green-600 focus-visible:ring-green-600")}
                                >
                                    <Undo2 className="h-5 w-5 md:h-4 md:w-4" />
                                    {t("common.restore")}
                                </button>
                            </DepartmentRestoreButton>
                        ) : (
                            <DepartmentDeleteButton
                                id={department.id}
                                name={department.name}
                                onDeleted={() => { onMutated(); setIsOpen(false); }}
                            >
                                <button
                                    type="button"
                                    role="menuitem"
                                    className={menuItemStyles.concat(" text-destructive hover:text-destructive focus-visible:ring-destructive")}
                                >
                                    <Trash2 className="h-5 w-5 md:h-4 md:w-4" />
                                    {t("common.delete")}
                                </button>
                            </DepartmentDeleteButton>
                        )}
                    </ProtectedContent>
                </div>
            )}
        </div>
    );
};

interface DepartmentCardProps {
    department: Department;
    onView: (department: Department) => void;
    onEdit: (department: Department) => void;
    onAddChild: (parentId: string) => void;
    onMutated: () => void;
}

const DepartmentCard = ({ department, onView, onEdit, onAddChild, onMutated }: DepartmentCardProps) => {
    const { t } = useTranslation();

    return (
        <article
            className={cn(
                "group relative flex h-full flex-col rounded-xl border border-border/70 bg-card/80 p-5 transition-shadow hover:z-30 hover:shadow-md focus-within:z-30 focus-within:shadow-md",
                department.isDeleted && "opacity-60"
            )}
        >
            <div className="absolute right-5 top-5 z-20">
                <DepartmentActionsDropdown
                    department={department}
                    onView={onView}
                    onEdit={onEdit}
                    onAddChild={onAddChild}
                    onMutated={onMutated}
                />
            </div>
            <header className="relative z-10 pr-12">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h2
                            className="text-lg font-semibold text-foreground sm:text-xl cursor-pointer hover:text-primary transition-colors"
                            onClick={() => onView(department)}
                        >
                            {department.name}
                        </h2>
                        {department.isDeleted && (
                            <Badge variant="secondary" className="text-xs bg-red-500/10 text-red-700 dark:text-red-400">
                                {t("templateCard.deleted")}
                            </Badge>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {department.parentDepartmentName
                            ? department.parentDepartmentName
                            : t("departments.rootDepartment")}
                    </p>
                    {department.subDepartments.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                            {t("departments.subDepartmentsCount", { count: department.subDepartments.length })}
                        </Badge>
                    )}
                    {department.supervisors.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                            {t("departments.supervisorsCount", { count: department.supervisors.length })}
                        </Badge>
                    )}
                </div>
            </header>
        </article>
    );
};

interface DepartmentListWidgetProps {
    departments: Department[];
    isInitialLoading: boolean;
    isLoadingMore: boolean;
    onCreateClick: () => void;
    onAddChildClick: (parentId: string) => void;
    onViewClick: (department: Department) => void;
    onEditClick: (department: Department) => void;
    onMutated: () => void;
    observerTargetRef: (node: HTMLDivElement | null) => void;
}

export const DepartmentListWidget = ({
    departments,
    isInitialLoading,
    isLoadingMore,
    onCreateClick,
    onAddChildClick,
    onViewClick,
    onEditClick,
    onMutated,
    observerTargetRef,
}: DepartmentListWidgetProps) => {
    const { t } = useTranslation();
    const hasDepartments = departments.length > 0;

    return (
        <div className="space-y-6">
            <CrudList>
                <ProtectedContent requiredPermissions={[PERMISSIONS.DEPARTMENT_EDIT]}>
                    <div className="group flex h-full flex-col items-start justify-between rounded-xl border border-dashed bg-card/80 p-5 text-left transition-all hover:border-brand/80 hover:shadow-md border-brand/60">
                        <div className="space-y-2">
                            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                {t("common.create")}
                            </p>
                            <h2 className="text-xl font-semibold text-foreground">
                                {t("departments.addButton")}
                            </h2>
                        </div>
                        <Button type="button" onClick={onCreateClick} className="mt-6 px-6 min-h-[48px] md:min-h-0">
                            {t("departments.addButton")}
                        </Button>
                    </div>
                </ProtectedContent>

                {isInitialLoading && (
                    <>
                        <DepartmentCardSkeleton />
                        <DepartmentCardSkeleton />
                        <DepartmentCardSkeleton />
                    </>
                )}

                {!isInitialLoading && hasDepartments
                    ? departments.map((dept) => (
                        <DepartmentCard
                            key={dept.id}
                            department={dept}
                            onView={onViewClick}
                            onEdit={onEditClick}
                            onAddChild={onAddChildClick}
                            onMutated={onMutated}
                        />
                    ))
                    : null}

                {!isInitialLoading && !hasDepartments && (
                    <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
                        {t("departments.empty")}
                    </p>
                )}
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
