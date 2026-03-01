import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useGenerateWeeklyReportMutation } from "@/entities/weekly-report";
import type { GenerateWeeklyReportDto } from "@/entities/weekly-report";

export const useWeeklyReportGenerate = () => {
    const { t } = useTranslation();
    const [generate, { isLoading }] = useGenerateWeeklyReportMutation();

    const handleGenerate = async (dto: GenerateWeeklyReportDto) => {
        try {
            await generate(dto).unwrap();
        } catch (error) {
            const message = (error as { message?: string })?.message;
            toast.error(message ?? t("errors.requestFailed"));
        }
    };

    return { handleGenerate, isLoading };
};
