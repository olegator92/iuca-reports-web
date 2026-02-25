import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useGenerateWeeklyReportMutation } from "@/entities/weekly-report";
import type { GenerateWeeklyReportDto } from "@/entities/weekly-report";

export const useWeeklyReportGenerate = () => {
    const { t } = useTranslation();
    const [generate, { isLoading }] = useGenerateWeeklyReportMutation();

    const handleGenerate = async (dto: GenerateWeeklyReportDto) => {
        await generate(dto).unwrap();
        toast.success(t("weeklyReports.generate.success"));
    };

    return { handleGenerate, isLoading };
};
