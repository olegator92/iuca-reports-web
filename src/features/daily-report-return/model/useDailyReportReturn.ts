import { useReturnDailyReportMutation } from "@/entities/daily-report";

export const useDailyReportReturn = () => {
    const [returnReport, { isLoading }] = useReturnDailyReportMutation();

    const handleReturn = async (id: string) => {
        await returnReport(id).unwrap();
    };

    return { handleReturn, isLoading };
};
