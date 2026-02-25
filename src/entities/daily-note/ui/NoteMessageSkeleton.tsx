import { Skeleton } from "@/shared/ui";
import { cn } from "@/shared/lib";

interface NoteMessageSkeletonProps {
    className?: string;
    width?: "sm" | "md" | "lg";
}

const widthClasses = {
    sm: "w-[120px]",
    md: "w-[200px]",
    lg: "w-[280px]"
};

export const NoteMessageSkeleton = ({ className, width = "md" }: NoteMessageSkeletonProps) => {
    return (
        <div className={cn("flex justify-end", className)}>
            <div className={cn("rounded-2xl rounded-tr-sm bg-muted/60 p-4", widthClasses[width])}>
                <Skeleton className="mb-2 h-3.5 w-full" />
                <Skeleton className="h-3.5 w-3/4" />
                <div className="mt-2 flex justify-end">
                    <Skeleton className="h-3 w-10" />
                </div>
            </div>
        </div>
    );
};
