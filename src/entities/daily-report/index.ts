export type { DailyReport, DailyReportStatus, UpdateReportContentDto, GenerateReportDto, CreateReportDto, GetDailyReportsByRangeDto } from "./model/types";
export { dailyReportReducer, setCurrentDate, setCurrentPosition } from "./model/dailyReportSlice";
export {
    dailyReportApi,
    useGetDailyReportByDateQuery,
    useGetDailyReportsByRangeQuery,
    useGetDailyReportByIdQuery,
    useGenerateDailyReportMutation,
    useCreateDailyReportMutation,
    useUpdateDailyReportContentMutation,
    useRegenerateDailyReportMutation,
    useSubmitDailyReportMutation,
    useReturnDailyReportMutation
} from "./api/dailyReportApi";
