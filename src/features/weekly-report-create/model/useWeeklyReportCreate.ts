import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useCreateWeeklyReportMutation } from "@/entities/weekly-report";
import type { CreateWeeklyReportDto, WeeklyReport } from "@/entities/weekly-report";

export const useWeeklyReportCreate = () => {
    const { t } = useTranslation();
    const [create, { isLoading }] = useCreateWeeklyReportMutation();

    const handleCreate = async (dto: CreateWeeklyReportDto): Promise<WeeklyReport | null> => {
        const report = await create(dto).unwrap();
        toast.success(t("weeklyReports.create.success"));
        return report;
    };

    return { handleCreate, isLoading };
};
