import { toast } from "sonner";
import { ensureSuccess, rtkApi } from "@/shared/api";
import type { ExtractedResult, PaginatedResponse, ResultEnvelope } from "@/shared/api";
import type { Position, CreatePositionRequest, UpdatePositionRequest } from "../model";

interface GetPositionsParams {
    page?: number;
    pageSize?: number;
    search?: string;
    includeDeleted?: boolean;
    sortBy?: string | null;
    sortDescending?: boolean;
}

interface GetPositionsResult {
    data: Position[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 12;
const POSITION_ENDPOINT = "/positions";

const buildSearchParams = ({
    page = DEFAULT_PAGE,
    pageSize = DEFAULT_PAGE_SIZE,
    search,
    includeDeleted,
    sortBy,
    sortDescending
}: GetPositionsParams) => {
    const params: Record<string, string | number | boolean> = {
        Page: page,
        PageSize: pageSize
    };

    if (search && search.trim().length > 0) {
        params.Search = search.trim();
    }

    if (includeDeleted !== undefined) {
        params.IncludeDeleted = includeDeleted;
    }

    if (sortBy) {
        params.SortBy = sortBy;
    }

    if (sortDescending !== undefined) {
        params.SortDescending = sortDescending;
    }

    return params;
};

const showSuccessToast = (message?: string | null) => {
    if (typeof message === "string" && message.trim().length > 0) {
        toast.success(message);
    }
};

export const positionApi = rtkApi.injectEndpoints({
    endpoints: (builder) => ({
        getPositions: builder.query<GetPositionsResult, GetPositionsParams | void>({
            query: (args) => {
                const { page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE, search, includeDeleted, sortBy, sortDescending } = args ?? {};
                return {
                    url: POSITION_ENDPOINT,
                    params: buildSearchParams({ page, pageSize, search, includeDeleted, sortBy, sortDescending })
                };
            },
            transformResponse: (response: ResultEnvelope<PaginatedResponse<Position>>, _meta, args) => {
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
                    return [{ type: "Position" as const, id: "LIST" }];
                }

                const entityTags = result.data.map((position) => ({ type: "Position" as const, id: position.id }));

                return [...entityTags, { type: "Position" as const, id: "LIST" }];
            }
        }),
        getAllPositions: builder.query<Position[], void>({
            query: () => ({
                url: `${POSITION_ENDPOINT}/all`
            }),
            transformResponse: (response: ResultEnvelope<Position[]>) => ensureSuccess(response).data,
            providesTags: (result) => {
                if (!result) {
                    return [{ type: "Position" as const, id: "LIST" }];
                }

                const entityTags = result.map((position) => ({ type: "Position" as const, id: position.id }));

                return [...entityTags, { type: "Position" as const, id: "LIST" }];
            }
        }),
        getPositionById: builder.query<Position, string>({
            query: (id) => ({
                url: `${POSITION_ENDPOINT}/${id}`
            }),
            transformResponse: (response: ResultEnvelope<Position>) => ensureSuccess(response).data,
            providesTags: (_result, _error, id) => [{ type: "Position", id }]
        }),
        createPosition: builder.mutation<ExtractedResult<Position>, CreatePositionRequest>({
            query: (position) => ({
                url: POSITION_ENDPOINT,
                method: "POST",
                body: position
            }),
            transformResponse: (response: ResultEnvelope<Position>) => ensureSuccess(response),
            invalidatesTags: [{ type: "Position", id: "LIST" }],
            async onQueryStarted(_arg, { queryFulfilled }) {
                try {
                    const { data: result } = await queryFulfilled;
                    showSuccessToast(result.message);
                } catch {
                    // Errors handled globally
                }
            }
        }),
        updatePosition: builder.mutation<ExtractedResult<Position>, { id: string; data: UpdatePositionRequest }>({
            query: ({ id, data }) => ({
                url: `${POSITION_ENDPOINT}/${id}`,
                method: "PUT",
                body: data
            }),
            transformResponse: (response: ResultEnvelope<Position>, _meta, { id, data }) => {
                const result = ensureSuccess(response, { allowNullData: true });
                const resolvedData = result.data ?? { id, ...data } as Position;
                return {
                    ...result,
                    data: resolvedData
                };
            },
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Position", id },
                { type: "Position", id: "LIST" }
            ],
            async onQueryStarted(_arg, { queryFulfilled }) {
                try {
                    const { data: result } = await queryFulfilled;
                    showSuccessToast(result.message);
                } catch {
                    // Errors handled globally
                }
            }
        }),
        deletePosition: builder.mutation<ExtractedResult<Position | null>, string>({
            query: (id) => ({
                url: `${POSITION_ENDPOINT}/${id}`,
                method: "DELETE"
            }),
            transformResponse: (response: ResultEnvelope<Position | null>) => ensureSuccess(response, { allowNullData: true }),
            invalidatesTags: (_result, _error, id) => [
                { type: "Position", id },
                { type: "Position", id: "LIST" }
            ],
            async onQueryStarted(_arg, { queryFulfilled }) {
                try {
                    const { data: result } = await queryFulfilled;
                    showSuccessToast(result.message);
                } catch {
                    // Errors handled globally
                }
            }
        }),
        restorePosition: builder.mutation<ExtractedResult<null>, string>({
            query: (id) => ({
                url: `${POSITION_ENDPOINT}/${id}/restore`,
                method: "POST"
            }),
            transformResponse: (response: ResultEnvelope<null>) => ensureSuccess(response, { allowNullData: true }),
            invalidatesTags: (_result, _error, id) => [
                { type: "Position", id },
                { type: "Position", id: "LIST" }
            ],
            async onQueryStarted(_arg, { queryFulfilled }) {
                try {
                    const { data: result } = await queryFulfilled;
                    showSuccessToast(result.message);
                } catch {
                    // Errors handled globally
                }
            }
        })
    }),
    overrideExisting: false
});

export const {
    useGetPositionsQuery,
    useLazyGetPositionsQuery,
    useGetAllPositionsQuery,
    useGetPositionByIdQuery,
    useCreatePositionMutation,
    useUpdatePositionMutation,
    useDeletePositionMutation,
    useRestorePositionMutation
} = positionApi;

export type { GetPositionsParams, GetPositionsResult };
