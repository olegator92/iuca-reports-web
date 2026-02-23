import { useRegenerateDailyReportMutation } from "@/entities/daily-report";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const useDailyReportRegenerate = () => {
    const { t } = useTranslation();
    const [regenerate, { isLoading }] = useRegenerateDailyReportMutation();

    const handleRegenerate = async (id: string) => {
        await regenerate(id).unwrap();
        toast.success(t("dailyReports.regenerate.success"));
    };

    return { handleRegenerate, isLoading };
};
