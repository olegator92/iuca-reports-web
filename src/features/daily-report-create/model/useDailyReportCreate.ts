import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useCreateDailyReportMutation } from "@/entities/daily-report";
import type { CreateReportDto, DailyReport } from "@/entities/daily-report";

export const useDailyReportCreate = () => {
    const { t } = useTranslation();
    const [create, { isLoading }] = useCreateDailyReportMutation();

    const handleCreate = async (dto: CreateReportDto): Promise<DailyReport | null> => {
        const result = await create(dto).unwrap();
        toast.success(t("dailyReports.create.success"));
        return result.data ?? null;
    };

    return { handleCreate, isLoading };
};
