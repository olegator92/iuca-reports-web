import type { ReactNode } from "react";
import type { Role } from "../model";
import { cn } from "@/shared/lib";
import { Badge } from "@/shared/ui";
import { useTranslation } from "react-i18next";

interface RoleCardProps {
    role: Role;
    actions?: ReactNode;
    className?: string;
    onNameClick?: () => void;
}

export const RoleCard = ({
    role,
    actions,
    className,
    onNameClick
}: RoleCardProps) => {
    const { t } = useTranslation();

    return (
        <article
            className={cn(
                "group relative flex h-full flex-col rounded-xl border border-border/70 bg-card/80 p-5 transition-shadow hover:z-30 hover:shadow-md focus-within:z-30 focus-within:shadow-md",
                className
            )}
        >
            {actions && (
                <div className="absolute right-5 top-5 z-20">
                    {actions}
                </div>
            )}
            <header className="relative z-10 pr-12">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <h2
                            className={cn(
                                "text-lg font-semibold text-foreground sm:text-xl",
                                onNameClick && "cursor-pointer hover:text-primary transition-colors"
                            )}
                            onClick={onNameClick}
                        >
                            {role.name}
                        </h2>
                        {role.isSystemRole && (
                            <Badge variant="secondary" className="text-xs">
                                {t("roles.systemRole")}
                            </Badge>
                        )}
                    </div>
                </div>
            </header>
        </article>
    );
};
