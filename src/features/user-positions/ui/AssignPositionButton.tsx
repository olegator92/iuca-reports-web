import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { useGetAllPositionsQuery } from "@/entities/position/api";
import type { User } from "@/entities/user/model";
import { useAssignPositionToUserMutation } from "@/entities/user/api";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Loader } from "@/shared/ui";
import { Building2 } from "lucide-react";

interface AssignPositionButtonProps {
    user: User;
}

export const AssignPositionButton = ({ user }: AssignPositionButtonProps) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPositionId, setSelectedPositionId] = useState<string | null>(null);

    const { data: allPositions = [], isLoading: isLoadingPositions } = useGetAllPositionsQuery();
    const [assignPosition, { isLoading: isAssigning }] = useAssignPositionToUserMutation();

    // Filter out positions already assigned to user
    const userPositionIds = user.positions.map((p) => p.id);
    const availablePositions = allPositions.filter(
        (position) => !userPositionIds.includes(position.id) && !position.isDeleted
    );

    const handleAssign = async () => {
        if (!selectedPositionId) return;

        try {
            await assignPosition({
                userId: user.id,
                positionId: selectedPositionId
            }).unwrap();
            setIsOpen(false);
            setSelectedPositionId(null);
        } catch {
            // Error handled by global error handler
        }
    };

    return (
        <>
            <Button
                type="button"
                onClick={() => setIsOpen(true)}
                size="sm"
                className="min-h-[48px] md:min-h-0 w-full sm:w-auto"
            >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">{t("positions.assignPosition")}</span>
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{t("positions.assignPositionTitle")}</DialogTitle>
                    </DialogHeader>

                    <div className="py-4">
                        {isLoadingPositions ? (
                            <Loader className="py-8" label={t("common.loading")} />
                        ) : availablePositions.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                {t("positions.noAvailablePositions")}
                            </p>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground mb-4">
                                    {t("positions.assignPositionDescription")}
                                </p>
                                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                    {availablePositions.map((position) => (
                                        <button
                                            key={position.id}
                                            onClick={() => setSelectedPositionId(position.id)}
                                            className={`w-full text-left p-3 rounded-lg border min-h-[48px] md:min-h-0 transition-colors ${
                                                selectedPositionId === position.id
                                                    ? "border-primary bg-primary/10"
                                                    : "border-border hover:border-primary/50 hover:bg-accent"
                                            }`}
                                        >
                                            <div className="flex items-start gap-2">
                                                <Building2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-sm">
                                                        {position.name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground mt-0.5">
                                                        {position.departmentName}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={isAssigning}
                            className="min-h-[48px] md:min-h-0"
                        >
                            {t("common.cancel")}
                        </Button>
                        <Button
                            onClick={handleAssign}
                            disabled={!selectedPositionId || isAssigning}
                            className="min-h-[48px] md:min-h-0"
                        >
                            {isAssigning ? t("common.loading") : t("positions.assign")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
