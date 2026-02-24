import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useRegenerateWeeklyReportMutation } from "@/entities/weekly-report";

export const useWeeklyReportRegenerate = () => {
    const { t } = useTranslation();
    const [regenerate, { isLoading }] = useRegenerateWeeklyReportMutation();

    const handleRegenerate = async (reportId: string) => {
        await regenerate(reportId).unwrap();
        toast.success(t("weeklyReports.regenerate.success"));
    };

    return { handleRegenerate, isLoading };
};
