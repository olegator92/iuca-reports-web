import { useGenerateDailyReportMutation } from "@/entities/daily-report";
import type { GenerateReportDto } from "@/entities/daily-report";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const useDailyReportGenerate = () => {
    const { t } = useTranslation();
    const [generate, { isLoading }] = useGenerateDailyReportMutation();

    const handleGenerate = async (dto: GenerateReportDto) => {
        await generate(dto).unwrap();
        toast.success(t("dailyReports.generate.success"));
    };

    return { handleGenerate, isLoading };
};
