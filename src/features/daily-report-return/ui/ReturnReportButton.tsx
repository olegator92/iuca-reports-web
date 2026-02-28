import { useTranslation } from "react-i18next";
import { Loader2, Undo2 } from "lucide-react";
import { Button } from "@/shared/ui";
import { ProtectedContent } from "@/shared/ui";
import { PERMISSIONS } from "@/shared/lib";
import { useDailyReportReturn } from "../model/useDailyReportReturn";

interface ReturnReportButtonProps {
    reportId: string;
}

export const ReturnReportButton = ({ reportId }: ReturnReportButtonProps) => {
    const { t } = useTranslation();
    const { handleReturn, isLoading } = useDailyReportReturn();

    return (
        <ProtectedContent requiredPermissions={[PERMISSIONS.DAILY_REPORT_EDIT]}>
            <Button
                variant="outline"
                size="sm"
                onClick={() => handleReturn(reportId)}
                disabled={isLoading}
                className="min-h-[48px] md:min-h-0 px-4"
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Undo2 className="h-4 w-4" />
                )}
                <span className="ml-1.5">{t("dailyReports.actions.return")}</span>
            </Button>
        </ProtectedContent>
    );
};
