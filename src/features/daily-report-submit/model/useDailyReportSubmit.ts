import { useSubmitDailyReportMutation } from "@/entities/daily-report";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const useDailyReportSubmit = () => {
    const { t } = useTranslation();
    const [submit, { isLoading }] = useSubmitDailyReportMutation();

    const handleSubmit = async (id: string) => {
        await submit(id).unwrap();
        toast.success(t("dailyReports.submit.success"));
    };

    return { handleSubmit, isLoading };
};
