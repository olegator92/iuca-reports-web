import { useTranslation } from "react-i18next";
import { FilePlus, Loader2 } from "lucide-react";
import { Button, ProtectedContent } from "@/shared/ui";
import { PERMISSIONS } from "@/shared/lib";
import { useWeeklyReportCreate } from "../model/useWeeklyReportCreate";

interface CreateWeeklyReportButtonProps {
    weekStart: string;
    weekEnd: string;
    positionId: string;
}

export const CreateWeeklyReportButton = ({ weekStart, weekEnd, positionId }: CreateWeeklyReportButtonProps) => {
    const { t } = useTranslation();
    const { handleCreate, isLoading } = useWeeklyReportCreate();

    return (
        <ProtectedContent requiredPermissions={[PERMISSIONS.WEEKLY_REPORT_EDIT]}>
            <Button
                variant="outline"
                size="sm"
                onClick={() => handleCreate({ weekStart, weekEnd, positionId })}
                disabled={isLoading}
                className="min-h-[48px] md:min-h-0 px-4"
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <FilePlus className="h-4 w-4" />
                )}
                <span className="ml-1.5">{t("weeklyReports.actions.create")}</span>
            </Button>
        </ProtectedContent>
    );
};
