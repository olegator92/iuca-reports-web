import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib";
import type {
    SupervisorDepartmentNode,
    SupervisorReportFilter,
} from "@/entities/supervisor-report";

/** Serialise a filter pair to a unique string key. */
function filterKey(f: SupervisorReportFilter): string {
    return `${f.userId}|${f.positionId}`;
}

/** Recursively collect all filter pairs for a department node and its children. */
function collectNodeFilters(node: SupervisorDepartmentNode): SupervisorReportFilter[] {
    const filters: SupervisorReportFilter[] = [];
    node.positions.forEach((p) =>
        p.users.forEach((u) => filters.push({ userId: u.userId, positionId: p.positionId }))
    );
    node.subDepartments.forEach((child) => filters.push(...collectNodeFilters(child)));
    return filters;
}

/** Returns true if a node has at least one user anywhere in its subtree. */
function hasAnyUsers(node: SupervisorDepartmentNode): boolean {
    if (node.positions.some((p) => p.users.length > 0)) return true;
    return node.subDepartments.some(hasAnyUsers);
}

/* ---- Department tree node ---------------------------------------------- */

interface TreeNodeProps {
    node: SupervisorDepartmentNode;
    selected: Set<string>;
    depth: number;
    onToggleItem: (f: SupervisorReportFilter) => void;
    onToggleDepartment: (node: SupervisorDepartmentNode) => void;
}

const TreeNode = ({ node, selected, depth, onToggleItem, onToggleDepartment }: TreeNodeProps) => {
    const [open, setOpen] = useState(true);
    const deptCheckRef = useRef<HTMLInputElement>(null);

    const allNodeFilters = collectNodeFilters(node);
    const checkedCount = allNodeFilters.filter((f) => selected.has(filterKey(f))).length;
    const allChecked = allNodeFilters.length > 0 && checkedCount === allNodeFilters.length;
    const someChecked = checkedCount > 0 && checkedCount < allNodeFilters.length;

    useEffect(() => {
        if (deptCheckRef.current) {
            deptCheckRef.current.indeterminate = someChecked;
        }
    }, [someChecked]);

    const visibleChildren = node.subDepartments.filter(hasAnyUsers);
    const isExpandable = visibleChildren.length > 0 || node.positions.some((p) => p.users.length > 0);

    return (
        <div>
            {/* Department header row */}
            <div
                className="flex items-center gap-1.5 rounded py-1.5 pr-2 hover:bg-muted/50"
                style={{ paddingLeft: `${8 + depth * 12}px` }}
            >
                {isExpandable ? (
                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {open ? (
                            <ChevronDown className="h-3 w-3" />
                        ) : (
                            <ChevronRight className="h-3 w-3" />
                        )}
                    </button>
                ) : (
                    <span className="w-3 shrink-0" />
                )}
                <input
                    ref={deptCheckRef}
                    type="checkbox"
                    id={`dept-${node.departmentId}`}
                    checked={allChecked}
                    onChange={() => onToggleDepartment(node)}
                    disabled={allNodeFilters.length === 0}
                    className={cn(
                        "h-4 w-4 shrink-0 cursor-pointer rounded border border-input bg-background",
                        "text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                        allNodeFilters.length === 0 && "cursor-not-allowed opacity-40"
                    )}
                />
                <label
                    htmlFor={`dept-${node.departmentId}`}
                    className="flex-1 min-w-0 cursor-pointer select-none truncate text-sm font-medium"
                >
                    {node.departmentName}
                </label>
            </div>

            {/* Leaf items (position + user) and sub-departments */}
            {isExpandable && open && (
                <div>
                    {node.positions.flatMap((pos) =>
                        pos.users.map((user) => {
                            const f: SupervisorReportFilter = { userId: user.userId, positionId: pos.positionId };
                            const key = filterKey(f);
                            return (
                                <div
                                    key={key}
                                    className="flex items-start gap-1.5 rounded py-1 pr-2 hover:bg-muted/50"
                                    style={{ paddingLeft: `${8 + (depth + 1) * 12 + 12}px` }}
                                >
                                    <input
                                        type="checkbox"
                                        id={`item-${key}`}
                                        checked={selected.has(key)}
                                        onChange={() => onToggleItem(f)}
                                        className={cn(
                                            "mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border border-input bg-background",
                                            "text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        )}
                                    />
                                    <label
                                        htmlFor={`item-${key}`}
                                        className="flex-1 min-w-0 cursor-pointer select-none flex flex-col"
                                    >
                                        <span className="truncate text-sm text-foreground leading-tight">{pos.positionName}</span>
                                        <span className="truncate text-xs text-muted-foreground">{user.fullName}</span>
                                    </label>
                                </div>
                            );
                        })
                    )}
                    {visibleChildren.map((child) => (
                        <TreeNode
                            key={child.departmentId}
                            node={child}
                            selected={selected}
                            depth={depth + 1}
                            onToggleItem={onToggleItem}
                            onToggleDepartment={onToggleDepartment}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

/* ---- Public component -------------------------------------------------- */

interface DepartmentFilterTreeProps {
    departments: SupervisorDepartmentNode[];
    selectedFilters: SupervisorReportFilter[];
    onChange: (filters: SupervisorReportFilter[]) => void;
}

export const DepartmentFilterTree = ({
    departments,
    selectedFilters,
    onChange,
}: DepartmentFilterTreeProps) => {
    const { t } = useTranslation();
    const selected = new Set(selectedFilters.map(filterKey));

    const handleToggleItem = (f: SupervisorReportFilter) => {
        const key = filterKey(f);
        if (selected.has(key)) {
            onChange(selectedFilters.filter((x) => filterKey(x) !== key));
        } else {
            onChange([...selectedFilters, f]);
        }
    };

    const handleToggleDepartment = (node: SupervisorDepartmentNode) => {
        const nodeFilters = collectNodeFilters(node);
        const nodeKeys = new Set(nodeFilters.map(filterKey));
        const allChecked = nodeFilters.every((f) => selected.has(filterKey(f)));
        if (allChecked) {
            onChange(selectedFilters.filter((f) => !nodeKeys.has(filterKey(f))));
        } else {
            const existing = selectedFilters.filter((f) => !nodeKeys.has(filterKey(f)));
            onChange([...existing, ...nodeFilters]);
        }
    };

    return (
        <div className="flex flex-col h-full min-h-0">
            {/* Header */}
            <div className="border-b px-3 py-2 shrink-0">
                <span className="text-sm font-medium">
                    {t("supervisorReports.positions")}
                </span>
            </div>

            {/* Tree */}
            <div className="custom-scrollbar flex-1 overflow-y-auto py-1">
                {departments.length === 0 ? (
                    <p className="px-3 py-4 text-center text-sm text-muted-foreground">
                        {t("supervisorReports.noPositions")}
                    </p>
                ) : (
                    departments.filter(hasAnyUsers).map((node) => (
                        <TreeNode
                            key={node.departmentId}
                            node={node}
                            selected={selected}
                            depth={0}
                            onToggleItem={handleToggleItem}
                            onToggleDepartment={handleToggleDepartment}
                        />
                    ))
                )}
            </div>
        </div>
    );
};
