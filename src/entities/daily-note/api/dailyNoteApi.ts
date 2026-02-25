import { ensureSuccess, rtkApi } from "@/shared/api";
import type { ExtractedResult, PaginatedResponse, ResultEnvelope } from "@/shared/api";
import type { DailyNote, CreateDailyNoteRequest, UpdateDailyNoteRequest } from "../model/types";

interface GetDailyNotesParams {
    page?: number;
    pageSize?: number;
    date?: string;
    positionId?: string;
    sortDescending?: boolean;
    includeDeleted?: boolean;
}

interface GetDailyNotesResult {
    data: DailyNote[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 30;
const DAILY_NOTES_ENDPOINT = "/daily-notes";

const buildSearchParams = ({
    page = DEFAULT_PAGE,
    pageSize = DEFAULT_PAGE_SIZE,
    date,
    positionId,
    sortDescending,
    includeDeleted
}: GetDailyNotesParams) => {
    const params: Record<string, string | number | boolean> = {
        Page: page,
        PageSize: pageSize
    };

    if (date) {
        params.Date = date;
    }

    if (positionId) {
        params.PositionId = positionId;
    }

    if (sortDescending !== undefined) {
        params.SortDescending = sortDescending;
    }

    if (includeDeleted !== undefined) {
        params.IncludeDeleted = includeDeleted;
    }

    return params;
};

export const dailyNoteApi = rtkApi.injectEndpoints({
    endpoints: (builder) => ({
        getDailyNotes: builder.query<GetDailyNotesResult, GetDailyNotesParams | void>({
            query: (args) => {
                const { page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE, date, positionId, sortDescending, includeDeleted } = args ?? {};
                return {
                    url: DAILY_NOTES_ENDPOINT,
                    params: buildSearchParams({ page, pageSize, date, positionId, sortDescending, includeDeleted })
                };
            },
            transformResponse: (response: ResultEnvelope<PaginatedResponse<DailyNote>>, _meta, args) => {
                const { page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE } = args ?? {};
                const { data: payload } = ensureSuccess(response);

                const resolvedPage = payload.page ?? page;
                const resolvedPageSize = payload.pageSize ?? pageSize;
                const resolvedTotal = payload.totalCount ?? 0;
                const resolvedTotalPages = payload.totalPages ?? Math.max(1, Math.ceil(resolvedTotal / resolvedPageSize));

                return {
                    data: payload.data ?? [],
                    total: resolvedTotal,
                    page: resolvedPage,
                    pageSize: resolvedPageSize,
                    totalPages: resolvedTotalPages,
                    hasPreviousPage: payload.hasPreviousPage ?? resolvedPage > 1,
                    hasNextPage: payload.hasNextPage ?? resolvedPage < resolvedTotalPages
                };
            },
            providesTags: (result) => {
                if (!result) {
                    return [{ type: "DailyNote" as const, id: "LIST" }];
                }
                const entityTags = result.data.map((note) => ({ type: "DailyNote" as const, id: note.id }));
                return [...entityTags, { type: "DailyNote" as const, id: "LIST" }];
            }
        }),
        getDailyNoteById: builder.query<DailyNote, string>({
            query: (id) => ({
                url: `${DAILY_NOTES_ENDPOINT}/${id}`
            }),
            transformResponse: (response: ResultEnvelope<DailyNote>) => ensureSuccess(response).data,
            providesTags: (_result, _error, id) => [{ type: "DailyNote", id }]
        }),
        createDailyNote: builder.mutation<ExtractedResult<DailyNote>, CreateDailyNoteRequest>({
            query: (body) => ({
                url: DAILY_NOTES_ENDPOINT,
                method: "POST",
                body
            }),
            transformResponse: (response: ResultEnvelope<DailyNote>) => ensureSuccess(response),
            invalidatesTags: [{ type: "DailyNote", id: "LIST" }, "DailyReport"]
        }),
        updateDailyNote: builder.mutation<ExtractedResult<DailyNote>, { id: string } & UpdateDailyNoteRequest>({
            query: ({ id, ...body }) => ({
                url: `${DAILY_NOTES_ENDPOINT}/${id}`,
                method: "PUT",
                body
            }),
            transformResponse: (response: ResultEnvelope<DailyNote>, _meta, arg) => {
                const result = ensureSuccess(response, { allowNullData: true });
                return {
                    ...result,
                    data: result.data ?? ({ id: arg.id, content: arg.content, noteDate: arg.noteDate, positionId: arg.positionId } as DailyNote)
                };
            },
            invalidatesTags: (_result, _error, arg) => [
                { type: "DailyNote", id: arg.id },
                { type: "DailyNote", id: "LIST" },
                "DailyReport"
            ]
        }),
        deleteDailyNote: builder.mutation<ExtractedResult<null>, string>({
            query: (id) => ({
                url: `${DAILY_NOTES_ENDPOINT}/${id}`,
                method: "DELETE"
            }),
            transformResponse: (response: ResultEnvelope<null>) => ensureSuccess(response, { allowNullData: true }),
            invalidatesTags: (_result, _error, id) => [
                { type: "DailyNote", id },
                { type: "DailyNote", id: "LIST" },
                "DailyReport"
            ]
        })
    }),
    overrideExisting: false
});

export const {
    useGetDailyNotesQuery,
    useLazyGetDailyNotesQuery,
    useGetDailyNoteByIdQuery,
    useCreateDailyNoteMutation,
    useUpdateDailyNoteMutation,
    useDeleteDailyNoteMutation
} = dailyNoteApi;

export type { GetDailyNotesParams, GetDailyNotesResult };
