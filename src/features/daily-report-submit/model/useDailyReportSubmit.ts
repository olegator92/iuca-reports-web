import { useSubmitDailyReportMutation } from "@/entities/daily-report";

export const useDailyReportSubmit = () => {
    const [submit, { isLoading }] = useSubmitDailyReportMutation();

    const handleSubmit = async (id: string) => {
        await submit(id).unwrap();
    };

    return { handleSubmit, isLoading };
};
