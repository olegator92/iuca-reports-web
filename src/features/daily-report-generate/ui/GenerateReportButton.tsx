import { useTranslation } from "react-i18next";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/shared/ui";
import { ProtectedContent } from "@/shared/ui";
import { PERMISSIONS } from "@/shared/lib";
import { useDailyReportGenerate } from "../model/useDailyReportGenerate";

interface GenerateReportButtonProps {
    date: string;
    positionId: string;
}

export const GenerateReportButton = ({ date, positionId }: GenerateReportButtonProps) => {
    const { t } = useTranslation();
    const { handleGenerate, isLoading } = useDailyReportGenerate();

    return (
        <ProtectedContent requiredPermissions={[PERMISSIONS.DAILY_REPORT_EDIT]}>
            <Button
                size="sm"
                onClick={() => handleGenerate({ date, positionId })}
                disabled={isLoading}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Sparkles className="h-4 w-4" />
                )}
                <span className="ml-1.5">{t("dailyReports.actions.generate")}</span>
            </Button>
        </ProtectedContent>
    );
};
