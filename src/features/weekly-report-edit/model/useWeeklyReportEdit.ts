import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useUpdateWeeklyReportMutation } from "@/entities/weekly-report";
import type { WeeklyReportStatus } from "@/entities/weekly-report";

export const useWeeklyReportEdit = (onSuccess?: () => void) => {
    const { t } = useTranslation();
    const [updateReport, { isLoading }] = useUpdateWeeklyReportMutation();

    const handleSave = async (id: string, content: string, status: WeeklyReportStatus) => {
        await updateReport({ id, content, status }).unwrap();
        toast.success(t("weeklyReports.edit.success"));
        onSuccess?.();
    };

    return { handleSave, isLoading };
};
