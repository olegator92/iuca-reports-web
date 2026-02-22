import { useTranslation } from "react-i18next";
import { Briefcase } from "lucide-react";
import { cn } from "@/shared/lib";
import type { CurrentUserPosition } from "@/entities/auth";

interface PositionSelectorProps {
    positions: CurrentUserPosition[];
    currentPositionId: string | null;
    onPositionChange: (positionId: string) => void;
}

export const PositionSelector = ({ positions, currentPositionId, onPositionChange }: PositionSelectorProps) => {
    const { t } = useTranslation();

    if (positions.length === 0) {
        return (
            <div className="flex items-center justify-center gap-2 border-b border-border bg-muted/40 px-4 py-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                    {t("dailyNotes.position.noPositions")}
                </span>
            </div>
        );
    }

    if (positions.length === 1) {
        return (
            <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-2">
                <Briefcase className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate text-xs font-medium text-foreground">
                    {positions[0].name}
                </span>
                {positions[0].departmentName && (
                    <span className="truncate text-xs text-muted-foreground">
                        · {positions[0].departmentName}
                    </span>
                )}
            </div>
        );
    }

    return (
        <div className="border-b border-border bg-muted/40">
            <div className="flex items-center justify-end gap-1 overflow-x-auto px-2 py-1 scrollbar-none">
                <Briefcase className="h-4 w-4 shrink-0 text-muted-foreground ml-1 mr-0.5" />
                {positions.map((position) => (
                    <button
                        key={position.id}
                        onClick={() => onPositionChange(position.id)}
                        className={cn(
                            "shrink-0 rounded-none px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer",
                            "min-h-[32px] touch-manipulation",
                            currentPositionId === position.id
                                ? "bg-brand/15 text-foreground border-b-2 border-b-brand/60"
                                : "bg-muted text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                        )}
                        title={position.departmentName}
                    >
                        {position.name}
                    </button>
                ))}
            </div>
        </div>
    );
};
