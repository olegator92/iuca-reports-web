import { useTranslation } from "react-i18next";
import { Badge } from "@/shared/ui";
import type { DailyReportStatus } from "@/entities/daily-report";

interface ReportStatusBadgeProps {
    status: DailyReportStatus;
}

export const ReportStatusBadge = ({ status }: ReportStatusBadgeProps) => {
    const { t } = useTranslation();

    if (status === "Generated") {
        return (
            <Badge variant="default" className="bg-green-600 text-white hover:bg-green-700">
                {t("dailyReports.status.generated")}
            </Badge>
        );
    }

    return (
        <Badge variant="secondary">
            {t("dailyReports.status.inProgress")}
        </Badge>
    );
};
