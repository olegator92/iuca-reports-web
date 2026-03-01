import { useSubmitWeeklyReportMutation } from "@/entities/weekly-report";

export const useWeeklyReportSubmit = () => {
    const [submit, { isLoading }] = useSubmitWeeklyReportMutation();

    const handleSubmit = async (reportId: string) => {
        await submit(reportId).unwrap();
    };

    return { handleSubmit, isLoading };
};
