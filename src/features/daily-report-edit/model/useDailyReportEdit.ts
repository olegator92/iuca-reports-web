import { useUpdateDailyReportContentMutation } from "@/entities/daily-report";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const useDailyReportEdit = (onSuccess?: () => void) => {
    const { t } = useTranslation();
    const [updateContent, { isLoading }] = useUpdateDailyReportContentMutation();

    const handleSave = async (id: string, content: string) => {
        await updateContent({ id, content }).unwrap();
        toast.success(t("dailyReports.edit.success"));
        onSuccess?.();
    };

    return { handleSave, isLoading };
};
