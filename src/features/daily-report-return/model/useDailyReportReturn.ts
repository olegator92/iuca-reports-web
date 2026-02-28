import { useReturnDailyReportMutation } from "@/entities/daily-report";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const useDailyReportReturn = () => {
    const { t } = useTranslation();
    const [returnReport, { isLoading }] = useReturnDailyReportMutation();

    const handleReturn = async (id: string) => {
        await returnReport(id).unwrap();
        toast.success(t("dailyReports.return.success"));
    };

    return { handleReturn, isLoading };
};
