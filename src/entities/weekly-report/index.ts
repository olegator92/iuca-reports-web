export type { WeeklyReport, WeeklyReportStatus, UpdateWeeklyReportContentDto, GenerateWeeklyReportDto } from "./model/types";
export { weeklyReportReducer, setWeek, setCurrentPosition } from "./model/weeklyReportSlice";
export {
    weeklyReportApi,
    useGetWeeklyReportsByRangeQuery,
    useGetWeeklyReportByIdQuery,
    useGenerateWeeklyReportMutation,
    useUpdateWeeklyReportMutation,
    useRegenerateWeeklyReportMutation
} from "./api/weeklyReportApi";
