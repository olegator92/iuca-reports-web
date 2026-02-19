import type { ReactNode } from "react";
import { cn } from "@/shared/lib";

interface CrudListProps {
    children: ReactNode;
    className?: string;
}

export const CrudList = ({ children, className }: CrudListProps) => {
    return (
        <div
            className={cn(
                "grid grid-cols-1 gap-3 sm:grid-cols-2",
                className,
            )}
        >
            {children}
        </div>
    );
};
