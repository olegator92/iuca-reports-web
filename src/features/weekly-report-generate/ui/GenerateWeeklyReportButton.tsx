import { useTranslation } from "react-i18next";
import { Loader2, Sparkles } from "lucide-react";
import { Button, ProtectedContent } from "@/shared/ui";
import { PERMISSIONS } from "@/shared/lib";
import { useWeeklyReportGenerate } from "../model/useWeeklyReportGenerate";

interface GenerateWeeklyReportButtonProps {
    weekStart: string;
    weekEnd: string;
    positionId: string;
}

export const GenerateWeeklyReportButton = ({ weekStart, weekEnd, positionId }: GenerateWeeklyReportButtonProps) => {
    const { t } = useTranslation();
    const { handleGenerate, isLoading } = useWeeklyReportGenerate();

    return (
        <ProtectedContent requiredPermissions={[PERMISSIONS.WEEKLY_REPORT_EDIT]}>
            <Button
                size="sm"
                onClick={() => handleGenerate({ weekStart, weekEnd, positionId })}
                disabled={isLoading}
                className="min-h-[48px] md:min-h-0 px-4"
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Sparkles className="h-4 w-4" />
                )}
                <span className="ml-1.5">{t("weeklyReports.actions.generate")}</span>
            </Button>
        </ProtectedContent>
    );
};
