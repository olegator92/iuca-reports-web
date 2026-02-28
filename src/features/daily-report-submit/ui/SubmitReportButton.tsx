import { useTranslation } from "react-i18next";
import { Loader2, SendHorizontal } from "lucide-react";
import { Button } from "@/shared/ui";
import { ProtectedContent } from "@/shared/ui";
import { PERMISSIONS } from "@/shared/lib";
import { useDailyReportSubmit } from "../model/useDailyReportSubmit";

interface SubmitReportButtonProps {
    reportId: string;
}

export const SubmitReportButton = ({ reportId }: SubmitReportButtonProps) => {
    const { t } = useTranslation();
    const { handleSubmit, isLoading } = useDailyReportSubmit();

    return (
        <ProtectedContent requiredPermissions={[PERMISSIONS.DAILY_REPORT_EDIT]}>
            <Button
                size="sm"
                onClick={() => handleSubmit(reportId)}
                disabled={isLoading}
                className="min-h-[48px] md:min-h-0 px-4"
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <SendHorizontal className="h-4 w-4" />
                )}
                <span className="ml-1.5">{t("dailyReports.actions.submit")}</span>
            </Button>
        </ProtectedContent>
    );
};
