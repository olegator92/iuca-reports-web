import { useTranslation } from "react-i18next";
import { Loader2, SendHorizontal } from "lucide-react";
import { Button, ProtectedContent } from "@/shared/ui";
import { PERMISSIONS } from "@/shared/lib";
import { useWeeklyReportSubmit } from "../model/useWeeklyReportSubmit";

interface SubmitWeeklyReportButtonProps {
    reportId: string;
}

export const SubmitWeeklyReportButton = ({ reportId }: SubmitWeeklyReportButtonProps) => {
    const { t } = useTranslation();
    const { handleSubmit, isLoading } = useWeeklyReportSubmit();

    return (
        <ProtectedContent requiredPermissions={[PERMISSIONS.WEEKLY_REPORT_EDIT]}>
            <Button
                onClick={() => handleSubmit(reportId)}
                disabled={isLoading}
                className="min-h-[48px] md:min-h-0 px-4"
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <SendHorizontal className="h-4 w-4" />
                )}
                <span className="ml-1.5">{t("weeklyReports.actions.submit")}</span>
            </Button>
        </ProtectedContent>
    );
};
