export type { WeeklyReport, WeeklyReportStatus, UpdateWeeklyReportContentDto, GenerateWeeklyReportDto, CreateWeeklyReportDto } from "./model/types";
export { weeklyReportReducer, setWeek, setCurrentPosition } from "./model/weeklyReportSlice";
export {
    weeklyReportApi,
    useGetWeeklyReportsByRangeQuery,
    useGetWeeklyReportByIdQuery,
    useGenerateWeeklyReportMutation,
    useUpdateWeeklyReportMutation,
    useRegenerateWeeklyReportMutation,
    useCreateWeeklyReportMutation,
    useSubmitWeeklyReportMutation,
    useReturnWeeklyReportMutation
} from "./api/weeklyReportApi";
