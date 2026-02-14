import { toast } from "sonner";
import { ensureSuccess, rtkApi } from "@/shared/api";
import type { ExtractedResult, PaginatedResponse, ResultEnvelope } from "@/shared/api";
import type { Template } from "../model";

interface GetTemplatesParams {
    page?: number;
    pageSize?: number;
    search?: string;
    includeDeleted?: boolean;
    sortBy?: string | null;
    sortDescending?: boolean;
}

interface GetTemplatesResult {
    data: Template[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const TEMPLATE_ENDPOINT = "/templates";

const buildSearchParams = ({
    page = DEFAULT_PAGE,
    pageSize = DEFAULT_PAGE_SIZE,
    search,
    includeDeleted,
    sortBy,
    sortDescending
}: GetTemplatesParams) => {
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

export const templateApi = rtkApi.injectEndpoints({
    endpoints: (builder) => ({
        getTemplates: builder.query<GetTemplatesResult, GetTemplatesParams | void>({
            query: (args) => {
                const { page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE, search, includeDeleted, sortBy, sortDescending } = args ?? {};
                return {
                    url: TEMPLATE_ENDPOINT,
                    params: buildSearchParams({ page, pageSize, search, includeDeleted, sortBy, sortDescending })
                };
            },
            transformResponse: (response: ResultEnvelope<PaginatedResponse<Template>>, _meta, args) => {
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
                    return [{ type: "Template" as const, id: "LIST" }];
                }

                const entityTags = result.data.map((template) => ({ type: "Template" as const, id: template.id }));

                return [...entityTags, { type: "Template" as const, id: "LIST" }];
            }
        }),
        getTemplateById: builder.query<Template, string>({
            query: (id) => ({
                url: `${TEMPLATE_ENDPOINT}/${id}`
            }),
            transformResponse: (response: ResultEnvelope<Template>) => ensureSuccess(response).data,
            providesTags: (_result, _error, id) => [{ type: "Template", id }]
        }),
        addTemplate: builder.mutation<ExtractedResult<Template>, Omit<Template, "id">>({
            query: (template) => ({
                url: TEMPLATE_ENDPOINT,
                method: "POST",
                body: template
            }),
            transformResponse: (response: ResultEnvelope<Template>) => ensureSuccess(response),
            invalidatesTags: [{ type: "Template", id: "LIST" }],
            async onQueryStarted(_arg, { queryFulfilled }) {
                try {
                    const { data: result } = await queryFulfilled;
                    showSuccessToast(result.message);
                } catch {
                    // Errors handled globally
                }
            }
        }),
        updateTemplate: builder.mutation<ExtractedResult<Template>, Template>({
            query: (template) => ({
                url: `${TEMPLATE_ENDPOINT}/${template.id}`,
                method: "PUT",
                body: template
            }),
            transformResponse: (response: ResultEnvelope<Template>, _meta, template) => {
                const result = ensureSuccess(response, { allowNullData: true });
                const resolvedData = result.data ?? template;
                return {
                    ...result,
                    data: resolvedData
                };
            },
            invalidatesTags: (_result, _error, template) => [
                { type: "Template", id: template.id },
                { type: "Template", id: "LIST" }
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
        deleteTemplate: builder.mutation<ExtractedResult<Template | null>, string>({
            query: (id) => ({
                url: `${TEMPLATE_ENDPOINT}/${id}`,
                method: "DELETE"
            }),
            transformResponse: (response: ResultEnvelope<Template | null>) => ensureSuccess(response, { allowNullData: true }),
            invalidatesTags: (_result, _error, id) => [
                { type: "Template", id },
                { type: "Template", id: "LIST" }
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
        restoreTemplate: builder.mutation<ExtractedResult<null>, string>({
            query: (id) => ({
                url: `${TEMPLATE_ENDPOINT}/${id}/restore`,
                method: "POST"
            }),
            transformResponse: (response: ResultEnvelope<null>) => ensureSuccess(response, { allowNullData: true }),
            invalidatesTags: (_result, _error, id) => [
                { type: "Template", id },
                { type: "Template", id: "LIST" }
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
    useGetTemplatesQuery,
    useLazyGetTemplatesQuery,
    useGetTemplateByIdQuery,
    useAddTemplateMutation,
    useUpdateTemplateMutation,
    useDeleteTemplateMutation,
    useRestoreTemplateMutation
} = templateApi;

export type { GetTemplatesParams, GetTemplatesResult };

