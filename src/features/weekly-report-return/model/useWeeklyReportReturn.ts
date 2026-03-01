import { useReturnWeeklyReportMutation } from "@/entities/weekly-report";

export const useWeeklyReportReturn = () => {
    const [returnReport, { isLoading }] = useReturnWeeklyReportMutation();

    const handleReturn = async (reportId: string) => {
        await returnReport(reportId).unwrap();
    };

    return { handleReturn, isLoading };
};
