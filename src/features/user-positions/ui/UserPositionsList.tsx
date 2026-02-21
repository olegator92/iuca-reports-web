import { useTranslation } from "react-i18next";
import { Building2 } from "lucide-react";
import type { User } from "@/entities/user/model";
import { Card } from "@/shared/ui";
import { RemovePositionButton } from "./RemovePositionButton";

interface UserPositionsListProps {
    user: User;
}

export const UserPositionsList = ({ user }: UserPositionsListProps) => {
    const { t } = useTranslation();

    if (user.positions.length === 0) {
        return (
            <div className="text-sm text-muted-foreground text-center py-8">
                {t("positions.noPositions")}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {user.positions.map((position) => (
                <Card
                    key={position.id}
                    className="p-4 min-h-[48px] md:min-h-0 flex items-center justify-between gap-3"
                >
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                        <Building2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                                {position.name}
                            </div>
                            <div className="text-xs text-muted-foreground truncate mt-0.5">
                                {position.departmentName}
                            </div>
                        </div>
                    </div>
                    <RemovePositionButton user={user} position={position} />
                </Card>
            ))}
        </div>
    );
};
