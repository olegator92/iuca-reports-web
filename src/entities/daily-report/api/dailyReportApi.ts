import { ensureSuccess, rtkApi } from "@/shared/api";
import type { ExtractedResult, ResultEnvelope } from "@/shared/api";
import type { DailyReport, GenerateReportDto, UpdateReportContentDto } from "../model/types";

const DAILY_REPORTS_ENDPOINT = "/daily-reports";

export const dailyReportApi = rtkApi.injectEndpoints({
    endpoints: (builder) => ({
        getDailyReportByDate: builder.query<DailyReport[], string>({
            query: (date) => ({
                url: DAILY_REPORTS_ENDPOINT,
                params: { date }
            }),
            transformResponse: (response: ResultEnvelope<DailyReport[]>) =>
                ensureSuccess(response).data ?? [],
            providesTags: ["DailyReport"],
            refetchOnMountOrArgChange: true
        }),
        getDailyReportById: builder.query<DailyReport, string>({
            query: (id) => ({
                url: `${DAILY_REPORTS_ENDPOINT}/${id}`
            }),
            transformResponse: (response: ResultEnvelope<DailyReport>) =>
                ensureSuccess(response).data,
            providesTags: ["DailyReport"]
        }),
        generateDailyReport: builder.mutation<ExtractedResult<DailyReport>, GenerateReportDto>({
            query: ({ date, positionId }) => ({
                url: `${DAILY_REPORTS_ENDPOINT}/${date}/generate`,
                method: "POST",
                params: { positionId }
            }),
            transformResponse: (response: ResultEnvelope<DailyReport>) =>
                ensureSuccess(response, { allowNullData: true }),
            invalidatesTags: ["DailyReport"]
        }),
        updateDailyReportContent: builder.mutation<ExtractedResult<DailyReport>, { id: string } & UpdateReportContentDto>({
            query: ({ id, content, status }) => ({
                url: `${DAILY_REPORTS_ENDPOINT}/${id}`,
                method: "PUT",
                body: { content, status: status === "Generated" ? 1 : 0 }
            }),
            transformResponse: (response: ResultEnvelope<DailyReport>) =>
                ensureSuccess(response, { allowNullData: true }),
            invalidatesTags: ["DailyReport"]
        }),
        regenerateDailyReport: builder.mutation<ExtractedResult<DailyReport>, string>({
            query: (id) => ({
                url: `${DAILY_REPORTS_ENDPOINT}/${id}/regenerate`,
                method: "POST"
            }),
            transformResponse: (response: ResultEnvelope<DailyReport>) =>
                ensureSuccess(response, { allowNullData: true }),
            invalidatesTags: ["DailyReport"]
        })
    }),
    overrideExisting: false
});

export const {
    useGetDailyReportByDateQuery,
    useGetDailyReportByIdQuery,
    useGenerateDailyReportMutation,
    useUpdateDailyReportContentMutation,
    useRegenerateDailyReportMutation
} = dailyReportApi;
