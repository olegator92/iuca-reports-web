import type { ReactNode } from "react";
import type { Position } from "../model";
import { cn } from "@/shared/lib";
import { useTranslation } from "react-i18next";
import { Badge } from "@/shared/ui";
import { Building2 } from "lucide-react";

interface PositionCardProps {
    position: Position;
    actions?: ReactNode;
    className?: string;
    onNameClick?: () => void;
}

export const PositionCard = ({
    position,
    actions,
    className,
    onNameClick,
}: PositionCardProps) => {
    const { t } = useTranslation();

    return (
        <article
            className={cn(
                "group relative flex h-full flex-col rounded-xl border border-border/70 bg-card/80 p-5 transition-shadow hover:z-30 hover:shadow-md focus-within:z-30 focus-within:shadow-md",
                className,
            )}
        >
            {actions && (
                <div className="absolute right-5 top-5 z-20">
                    {actions}
                </div>
            )}
            <header className="relative z-10 pr-12">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h2
                            className={cn(
                                "text-lg font-semibold text-foreground sm:text-xl",
                                onNameClick && "cursor-pointer hover:text-primary transition-colors"
                            )}
                            onClick={onNameClick}
                        >
                            {position.name}
                        </h2>
                        {position.isDeleted && (
                            <Badge
                                variant="secondary"
                                className="text-xs bg-red-500/10 text-red-700 dark:text-red-400"
                            >
                                {t("positions.deletedBadge")}
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        <span>{position.departmentName}</span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1 pt-2">
                        <p>
                            {t("common.createdAt")}: {new Date(position.createdAt).toLocaleDateString()}
                        </p>
                        {position.updatedAt && (
                            <p>
                                {t("common.updatedAt")}: {new Date(position.updatedAt).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                </div>
            </header>
        </article>
    );
};
