import { useGenerateDailyReportMutation } from "@/entities/daily-report";
import type { GenerateReportDto } from "@/entities/daily-report";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const useDailyReportGenerate = () => {
    const { t } = useTranslation();
    const [generate, { isLoading }] = useGenerateDailyReportMutation();

    const handleGenerate = async (dto: GenerateReportDto) => {
        try {
            await generate(dto).unwrap();
        } catch (error) {
            const message = (error as { message?: string })?.message;
            toast.error(message ?? t("errors.requestFailed"));
        }
    };

    return { handleGenerate, isLoading };
};
