import { useTranslation } from "react-i18next";
import { Briefcase } from "lucide-react";
import { Button, ProtectedContent } from "@/shared/ui";
import { PERMISSIONS } from "@/shared/lib";

interface CreatePositionButtonProps {
    onClick: () => void;
}

export const CreatePositionButton = ({ onClick }: CreatePositionButtonProps) => {
    const { t } = useTranslation("positions");

    return (
        <ProtectedContent requiredPermissions={[PERMISSIONS.POSITION_EDIT]}>
            <Button
                onClick={onClick}
                className="min-h-[48px] md:min-h-0 w-full sm:w-auto"
            >
                <Briefcase className="h-5 w-5 sm:mr-2" />
                <span className="hidden sm:inline">{t("createButton")}</span>
            </Button>
        </ProtectedContent>
    );
};
