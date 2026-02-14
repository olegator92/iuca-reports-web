import { cn } from "@/shared/lib";
import type { HTMLAttributes } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
}

const roundedClassMap: Record<NonNullable<SkeletonProps["rounded"]>, string> = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
};

export const Skeleton = ({
    className,
    rounded = "lg",
    ...props
}: SkeletonProps) => {
    return (
        <div
            className={cn(
                "animate-pulse bg-muted/60",
                roundedClassMap[rounded],
                className,
            )}
            {...props}
        />
    );
};

