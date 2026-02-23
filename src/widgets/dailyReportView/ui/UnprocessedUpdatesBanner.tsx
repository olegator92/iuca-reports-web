import { useTranslation } from "react-i18next";
import { AlertCircle } from "lucide-react";
import { RegenerateReportButton } from "@/features/daily-report-regenerate";

interface UnprocessedUpdatesBannerProps {
    reportId: string;
}

export const UnprocessedUpdatesBanner = ({ reportId }: UnprocessedUpdatesBannerProps) => {
    const { t } = useTranslation();

    return (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-950/30">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    {t("dailyReports.unprocessedUpdates.banner")}
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                    {t("dailyReports.unprocessedUpdates.regenerateHint")}
                </p>
            </div>
            <RegenerateReportButton reportId={reportId} />
        </div>
    );
};
