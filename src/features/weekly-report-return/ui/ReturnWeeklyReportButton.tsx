import { useTranslation } from "react-i18next";
import { Loader2, Undo2 } from "lucide-react";
import { Button, ProtectedContent } from "@/shared/ui";
import { PERMISSIONS } from "@/shared/lib";
import { useWeeklyReportReturn } from "../model/useWeeklyReportReturn";

interface ReturnWeeklyReportButtonProps {
    reportId: string;
}

export const ReturnWeeklyReportButton = ({ reportId }: ReturnWeeklyReportButtonProps) => {
    const { t } = useTranslation();
    const { handleReturn, isLoading } = useWeeklyReportReturn();

    return (
        <ProtectedContent requiredPermissions={[PERMISSIONS.WEEKLY_REPORT_EDIT]}>
            <Button
                variant="outline"
                onClick={() => handleReturn(reportId)}
                disabled={isLoading}
                className="min-h-[48px] md:min-h-0 px-4"
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Undo2 className="h-4 w-4" />
                )}
                <span className="ml-1.5">{t("weeklyReports.actions.return")}</span>
            </Button>
        </ProtectedContent>
    );
};
