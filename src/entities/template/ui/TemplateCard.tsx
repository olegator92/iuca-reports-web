import type { ReactNode } from "react";
import type { Template } from "../model";
import { cn } from "@/shared/lib";
import { useTranslation } from "react-i18next";
import { Badge } from "@/shared/ui";

interface TemplateCardProps {
    template: Template;
    actions?: ReactNode;
    className?: string;
    onNameClick?: () => void;
}

export const TemplateCard = ({
    template,
    actions,
    className,
    onNameClick,
}: TemplateCardProps) => {
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
                            {template.name}
                        </h2>
                        {template.isDeleted && (
                            <Badge
                                variant="secondary"
                                className="text-xs bg-red-500/10 text-red-700 dark:text-red-400"
                            >
                                {t("templateCard.deleted")}
                            </Badge>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3 sm:text-base">
                        {template.description || t("templateCard.noDescription")}
                    </p>
                </div>
            </header>
        </article>
    );
};
