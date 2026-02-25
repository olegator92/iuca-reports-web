import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge, Button, ProtectedContent } from "@/shared/ui";
import { ChevronDown, ChevronRight, Building2, FolderPlus, MoreVertical, Pencil, Trash2, Undo2 } from "lucide-react";
import { PERMISSIONS } from "@/shared/lib";
import { DepartmentDeleteButton } from "@/features/department-delete";
import { DepartmentRestoreButton } from "@/features/department-restore";
import type { Department } from "@/entities/department/model";

const menuItemStyles =
    "flex w-full items-center gap-3 rounded-md px-4 py-4 md:px-3 md:py-2 text-base md:text-sm text-muted-foreground transition hover:bg-muted/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer min-h-[56px] md:min-h-0 border-b border-border/50 last:border-b-0";

interface TreeNodeActionsDropdownProps {
    department: Department;
    onView: (department: Department) => void;
    onEdit: (department: Department) => void;
    onAddChild: (parentId: string) => void;
    onMutated: () => void;
}

const TreeNodeActionsDropdown = ({
    department,
    onView,
    onEdit,
    onAddChild,
    onMutated,
}: TreeNodeActionsDropdownProps) => {
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
        <div className="relative shrink-0">
            <Button
                ref={triggerRef}
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8 md:h-7 md:w-7 rounded-md text-muted-foreground hover:text-foreground"
                aria-haspopup="menu"
                aria-expanded={isOpen}
                onClick={(e) => { e.stopPropagation(); setIsOpen((prev) => !prev); }}
            >
                <MoreVertical className="size-5 md:h-4 md:w-4" strokeWidth={2.5} />
                <span className="sr-only">{t("common.actions")}</span>
            </Button>

            {isOpen && (
                <div
                    ref={menuRef}
                    role="menu"
                    className="absolute right-0 top-full z-50 mt-1 w-[calc(100vw-2rem)] max-w-[320px] md:w-52 rounded-lg border border-border bg-popover p-2 md:p-1 shadow-lg"
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
                                    className={menuItemStyles.concat(" text-green-600 hover:text-green-600")}
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
                                    className={menuItemStyles.concat(" text-destructive hover:text-destructive")}
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

interface DepartmentTreeNodeProps {
    department: Department;
    depth: number;
    onEdit: (department: Department) => void;
    onView: (department: Department) => void;
    onAddChild: (parentId: string) => void;
    onMutated: () => void;
}

export const DepartmentTreeNode = ({
    department,
    depth,
    onEdit,
    onView,
    onAddChild,
    onMutated,
}: DepartmentTreeNodeProps) => {
    const [isExpanded, setIsExpanded] = useState(depth === 0);

    const hasChildren = department.subDepartments.length > 0;

    return (
        <div className={depth > 0 ? "ml-5 border-l border-border/40 pl-3" : ""}>
            <div
                className={`flex items-center gap-1 rounded-md px-1 py-2 border-b border-border/50 hover:bg-muted transition-colors ${hasChildren ? "cursor-pointer" : ""}`}
                onClick={hasChildren ? () => setIsExpanded((prev) => !prev) : undefined}
            >
                {/* Expand/collapse or leaf indicator */}
                {hasChildren ? (
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
                        onClick={(e) => { e.stopPropagation(); setIsExpanded((prev) => !prev); }}
                        aria-expanded={isExpanded}
                    >
                        {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </Button>
                ) : (
                    <span className="h-6 w-6 shrink-0 flex items-center justify-center">
                        <Building2 className="h-3 w-3 text-muted-foreground/40" />
                    </span>
                )}

                {/* Department name */}
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground py-0.5">
                    {department.name}
                </span>

                {/* Sub-department count badge */}
                {hasChildren && (
                    <Badge variant="secondary" className="text-xs shrink-0">
                        {department.subDepartments.length}
                    </Badge>
                )}

                {/* Actions dropdown — always visible */}
                <TreeNodeActionsDropdown
                    department={department}
                    onView={onView}
                    onEdit={onEdit}
                    onAddChild={onAddChild}
                    onMutated={onMutated}
                />
            </div>

            {isExpanded && hasChildren && (
                <div>
                    {department.subDepartments.map((child) => (
                        <DepartmentTreeNode
                            key={child.id}
                            department={child}
                            depth={depth + 1}
                            onEdit={onEdit}
                            onView={onView}
                            onAddChild={onAddChild}
                            onMutated={onMutated}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
