import { useTranslation } from "react-i18next";
import { useGetDepartmentHierarchyQuery, type Department } from "@/entities/department/model";
import { Loader, Skeleton } from "@/shared/ui";
import { DepartmentTreeNode } from "./DepartmentTreeNode";

interface DepartmentHierarchyWidgetProps {
    onEdit: (department: Department) => void;
    onView: (department: Department) => void;
    onAddChild: (parentId: string) => void;
    onMutated: () => void;
}

const HierarchySkeleton = () => (
    <div className="space-y-3">
        <Skeleton className="h-8 w-3/4 rounded-md" />
        <div className="ml-8 space-y-3">
            <Skeleton className="h-8 w-1/2 rounded-md" />
            <Skeleton className="h-8 w-2/3 rounded-md" />
        </div>
        <Skeleton className="h-8 w-1/2 rounded-md" />
    </div>
);

export const DepartmentHierarchyWidget = ({
    onEdit,
    onView,
    onAddChild,
    onMutated,
}: DepartmentHierarchyWidgetProps) => {
    const { t } = useTranslation();
    const { data: hierarchy = [], isLoading, isFetching } = useGetDepartmentHierarchyQuery();

    if (isLoading) {
        return (
            <div className="space-y-4 pt-4">
                <HierarchySkeleton />
            </div>
        );
    }

    if (hierarchy.length === 0) {
        return (
            <p className="py-8 text-center text-sm text-muted-foreground">
                {t("departments.hierarchyEmpty")}
            </p>
        );
    }

    return (
        <div className="space-y-0.5 pt-2 overflow-x-hidden">
            {isFetching && !isLoading && (
                <div className="flex items-center gap-2 pb-2 text-xs text-muted-foreground">
                    <Loader mode="inline" size="sm" />
                </div>
            )}
            {hierarchy.map((dept) => (
                <DepartmentTreeNode
                    key={dept.id}
                    department={dept}
                    depth={0}
                    onEdit={onEdit}
                    onView={onView}
                    onAddChild={onAddChild}
                    onMutated={onMutated}
                />
            ))}
        </div>
    );
};
