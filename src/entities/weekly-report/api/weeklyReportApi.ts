import { ensureSuccess, rtkApi } from "@/shared/api";
import type { ResultEnvelope } from "@/shared/api";
import type { WeeklyReport, GenerateWeeklyReportDto, RegenerateWeeklyReportDto, CreateWeeklyReportDto, UpdateWeeklyReportContentDto } from "../model/types";

const WEEKLY_REPORTS_ENDPOINT = "/weekly-reports";

export const weeklyReportApi = rtkApi.injectEndpoints({
    endpoints: (builder) => ({
        // Returns all weekly reports for the user's positions in the given period (one per position).
        // 404 when no reports exist — treated as empty array, not shown as error.
        getWeeklyReportsByRange: builder.query<WeeklyReport[], { weekStart: string; weekEnd: string }>({
            queryFn: async ({ weekStart, weekEnd }, _queryApi, _extraOptions, baseQuery) => {
                const result = await baseQuery({
                    url: WEEKLY_REPORTS_ENDPOINT,
                    params: { weekStart, weekEnd }
                });

                if (result.error) {
                    if ("status" in result.error && result.error.status === 404) {
                        return { data: [] };
                    }
                    return { error: result.error };
                }

                const envelope = result.data as ResultEnvelope<WeeklyReport | WeeklyReport[]>;
                const raw = ensureSuccess(envelope, { allowNullData: true }).data;
                if (!raw) return { data: [] };
                return { data: Array.isArray(raw) ? raw : [raw] };
            },
            extraOptions: { suppress404: true },
            providesTags: ["WeeklyReport"]
        }),
        getWeeklyReportById: builder.query<WeeklyReport, string>({
            query: (id) => ({
                url: `${WEEKLY_REPORTS_ENDPOINT}/${id}`
            }),
            transformResponse: (response: ResultEnvelope<WeeklyReport>) =>
                ensureSuccess(response).data,
            providesTags: ["WeeklyReport"]
        }),
        generateWeeklyReport: builder.mutation<WeeklyReport | null, GenerateWeeklyReportDto>({
            query: ({ weekStart, weekEnd, positionId, detailLevel }) => ({
                url: `${WEEKLY_REPORTS_ENDPOINT}/generate`,
                method: "POST",
                params: { weekStart, weekEnd, positionId, ...(detailLevel !== undefined && { detailLevel }) }
            }),
            transformResponse: (response: ResultEnvelope<WeeklyReport>) =>
                ensureSuccess(response, { allowNullData: true }).data ?? null,
            invalidatesTags: ["WeeklyReport"]
        }),
        updateWeeklyReport: builder.mutation<WeeklyReport | null, { id: string } & UpdateWeeklyReportContentDto>({
            query: ({ id, content }) => ({
                url: `${WEEKLY_REPORTS_ENDPOINT}/${id}`,
                method: "PUT",
                body: { content }
            }),
            transformResponse: (response: ResultEnvelope<WeeklyReport>) =>
                ensureSuccess(response, { allowNullData: true }).data ?? null,
            invalidatesTags: ["WeeklyReport"]
        }),
        regenerateWeeklyReport: builder.mutation<WeeklyReport | null, RegenerateWeeklyReportDto>({
            query: ({ id, detailLevel }) => ({
                url: `${WEEKLY_REPORTS_ENDPOINT}/${id}/regenerate`,
                method: "POST",
                params: detailLevel !== undefined ? { detailLevel } : undefined
            }),
            transformResponse: (response: ResultEnvelope<WeeklyReport>) =>
                ensureSuccess(response, { allowNullData: true }).data ?? null,
            invalidatesTags: ["WeeklyReport"]
        }),
        createWeeklyReport: builder.mutation<WeeklyReport | null, CreateWeeklyReportDto>({
            query: ({ weekStart, weekEnd, positionId }) => ({
                url: `${WEEKLY_REPORTS_ENDPOINT}/create`,
                method: "POST",
                params: { weekStart, weekEnd, positionId }
            }),
            transformResponse: (response: ResultEnvelope<WeeklyReport>) =>
                ensureSuccess(response, { allowNullData: true }).data ?? null,
            invalidatesTags: ["WeeklyReport"]
        }),
        submitWeeklyReport: builder.mutation<WeeklyReport | null, string>({
            query: (id) => ({
                url: `${WEEKLY_REPORTS_ENDPOINT}/${id}/submit`,
                method: "POST"
            }),
            transformResponse: (response: ResultEnvelope<WeeklyReport>) =>
                ensureSuccess(response, { allowNullData: true }).data ?? null,
            invalidatesTags: ["WeeklyReport"]
        }),
        returnWeeklyReport: builder.mutation<WeeklyReport | null, string>({
            query: (id) => ({
                url: `${WEEKLY_REPORTS_ENDPOINT}/${id}/return`,
                method: "POST"
            }),
            transformResponse: (response: ResultEnvelope<WeeklyReport>) =>
                ensureSuccess(response, { allowNullData: true }).data ?? null,
            invalidatesTags: ["WeeklyReport"]
        })
    }),
    overrideExisting: false
});

export const {
    useGetWeeklyReportsByRangeQuery,
    useGetWeeklyReportByIdQuery,
    useGenerateWeeklyReportMutation,
    useUpdateWeeklyReportMutation,
    useRegenerateWeeklyReportMutation,
    useCreateWeeklyReportMutation,
    useSubmitWeeklyReportMutation,
    useReturnWeeklyReportMutation
} = weeklyReportApi;
