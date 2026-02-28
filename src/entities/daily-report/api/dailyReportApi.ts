import { ensureSuccess, rtkApi } from "@/shared/api";
import type { ExtractedResult, ResultEnvelope } from "@/shared/api";
import type { DailyReport, CreateReportDto, GenerateReportDto, UpdateReportContentDto, GetDailyReportsByRangeDto } from "../model/types";

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
            providesTags: ["DailyReport"]
        }),
        getDailyReportsByRange: builder.query<DailyReport[], GetDailyReportsByRangeDto>({
            query: ({ dateFrom, dateTo }) => ({
                url: DAILY_REPORTS_ENDPOINT,
                params: { dateFrom, dateTo }
            }),
            transformResponse: (response: ResultEnvelope<DailyReport[]>) =>
                ensureSuccess(response).data ?? [],
            providesTags: ["DailyReport"]
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
        createDailyReport: builder.mutation<ExtractedResult<DailyReport>, CreateReportDto>({
            query: ({ date, positionId }) => ({
                url: `${DAILY_REPORTS_ENDPOINT}/${date}/create`,
                method: "POST",
                params: { positionId }
            }),
            transformResponse: (response: ResultEnvelope<DailyReport>) =>
                ensureSuccess(response, { allowNullData: true }),
            invalidatesTags: ["DailyReport"]
        }),
        updateDailyReportContent: builder.mutation<ExtractedResult<DailyReport>, { id: string } & UpdateReportContentDto>({
            query: ({ id, content }) => ({
                url: `${DAILY_REPORTS_ENDPOINT}/${id}`,
                method: "PUT",
                body: { content }
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
        }),
        submitDailyReport: builder.mutation<ExtractedResult<DailyReport>, string>({
            query: (id) => ({
                url: `${DAILY_REPORTS_ENDPOINT}/${id}/submit`,
                method: "POST"
            }),
            transformResponse: (response: ResultEnvelope<DailyReport>) =>
                ensureSuccess(response, { allowNullData: true }),
            invalidatesTags: ["DailyReport"]
        }),
        returnDailyReport: builder.mutation<ExtractedResult<DailyReport>, string>({
            query: (id) => ({
                url: `${DAILY_REPORTS_ENDPOINT}/${id}/return`,
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
    useGetDailyReportsByRangeQuery,
    useGetDailyReportByIdQuery,
    useGenerateDailyReportMutation,
    useCreateDailyReportMutation,
    useUpdateDailyReportContentMutation,
    useRegenerateDailyReportMutation,
    useSubmitDailyReportMutation,
    useReturnDailyReportMutation
} = dailyReportApi;
