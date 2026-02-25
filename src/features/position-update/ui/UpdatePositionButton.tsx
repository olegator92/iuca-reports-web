import type { ReactNode } from "react";
import type { Position } from "@/entities/position";
import { ProtectedContent } from "@/shared/ui";
import { PERMISSIONS } from "@/shared/lib";
import { Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";

interface UpdatePositionButtonProps {
    position: Position;
    onEdit: (position: Position) => void;
    children?: ReactNode;
}

export const UpdatePositionButton = ({
    position,
    onEdit,
    children,
}: UpdatePositionButtonProps) => {
    const { t } = useTranslation("positions");

    const menuItemStyles =
        "flex w-full items-center gap-3 rounded-md px-4 py-4 md:px-3 md:py-2 text-base md:text-sm text-muted-foreground transition hover:bg-muted/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer min-h-[56px] md:min-h-0";

    return (
        <ProtectedContent requiredPermissions={[PERMISSIONS.POSITION_EDIT]}>
            {children ?? (
                <button
                    type="button"
                    onClick={() => onEdit(position)}
                    className={menuItemStyles}
                >
                    <Pencil className="h-5 w-5 flex-shrink-0" />
                    <span>{t("edit")}</span>
                </button>
            )}
        </ProtectedContent>
    );
};
