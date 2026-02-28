import { useCreateDailyReportMutation } from "@/entities/daily-report";
import type { CreateReportDto } from "@/entities/daily-report";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const useDailyReportCreate = () => {
    const { t } = useTranslation();
    const [create, { isLoading }] = useCreateDailyReportMutation();

    const handleCreate = async (dto: CreateReportDto) => {
        await create(dto).unwrap();
        toast.success(t("dailyReports.create.success"));
    };

    return { handleCreate, isLoading };
};
