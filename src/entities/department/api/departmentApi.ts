import { ensureSuccess, rtkApi } from "@/shared/api";
import type { ExtractedResult, PaginatedResponse, ResultEnvelope } from "@/shared/api";
import type { Department, CreateDepartmentDto, UpdateDepartmentDto } from "../model/types";

interface GetDepartmentsParams {
    page?: number;
    pageSize?: number;
    search?: string;
    includeDeleted?: boolean;
    sortBy?: string | null;
    sortDescending?: boolean;
}

interface GetDepartmentsResult {
    data: Department[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEPARTMENT_ENDPOINT = "/departments";

const buildSearchParams = ({
    page = DEFAULT_PAGE,
    pageSize = DEFAULT_PAGE_SIZE,
    search,
    includeDeleted,
    sortBy,
    sortDescending
}: GetDepartmentsParams) => {
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

export const departmentApi = rtkApi.injectEndpoints({
    endpoints: (builder) => ({
        getDepartments: builder.query<GetDepartmentsResult, GetDepartmentsParams | void>({
            query: (args) => {
                const { page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE, search, includeDeleted, sortBy, sortDescending } = args ?? {};
                return {
                    url: DEPARTMENT_ENDPOINT,
                    params: buildSearchParams({ page, pageSize, search, includeDeleted, sortBy, sortDescending })
                };
            },
            transformResponse: (response: ResultEnvelope<PaginatedResponse<Department>>, _meta, args) => {
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
                    return [{ type: "Department" as const, id: "LIST" }];
                }
                const entityTags = result.data.map((dept) => ({ type: "Department" as const, id: dept.id }));
                return [...entityTags, { type: "Department" as const, id: "LIST" }];
            }
        }),
        getAllDepartments: builder.query<Department[], void>({
            query: () => ({
                url: `${DEPARTMENT_ENDPOINT}/all`
            }),
            transformResponse: (response: ResultEnvelope<Department[]>) => {
                const { data } = ensureSuccess(response);
                return data ?? [];
            },
            providesTags: [{ type: "Department" as const, id: "LIST" }]
        }),
        getDepartmentHierarchy: builder.query<Department[], void>({
            query: () => ({
                url: `${DEPARTMENT_ENDPOINT}/hierarchy`
            }),
            transformResponse: (response: ResultEnvelope<Department[]>) => {
                const { data } = ensureSuccess(response);
                return data ?? [];
            },
            providesTags: [{ type: "Department" as const, id: "LIST" }]
        }),
        getDepartmentById: builder.query<Department, string>({
            query: (id) => ({
                url: `${DEPARTMENT_ENDPOINT}/${id}`
            }),
            transformResponse: (response: ResultEnvelope<Department>) => ensureSuccess(response).data,
            providesTags: (_result, _error, id) => [{ type: "Department", id }]
        }),
        createDepartment: builder.mutation<ExtractedResult<Department>, CreateDepartmentDto>({
            query: (dto) => ({
                url: DEPARTMENT_ENDPOINT,
                method: "POST",
                body: dto
            }),
            transformResponse: (response: ResultEnvelope<Department>) => ensureSuccess(response),
            invalidatesTags: [{ type: "Department", id: "LIST" }]
        }),
        updateDepartment: builder.mutation<ExtractedResult<Department>, { id: string; dto: UpdateDepartmentDto }>({
            query: ({ id, dto }) => ({
                url: `${DEPARTMENT_ENDPOINT}/${id}`,
                method: "PUT",
                body: dto
            }),
            transformResponse: (response: ResultEnvelope<Department>, _meta, arg) => {
                const result = ensureSuccess(response, { allowNullData: true });
                return {
                    ...result,
                    data: result.data ?? { id: arg.id, ...arg.dto } as unknown as Department
                };
            },
            invalidatesTags: (_result, _error, arg) => [
                { type: "Department", id: arg.id },
                { type: "Department", id: "LIST" }
            ]
        }),
        deleteDepartment: builder.mutation<ExtractedResult<Department | null>, string>({
            query: (id) => ({
                url: `${DEPARTMENT_ENDPOINT}/${id}`,
                method: "DELETE"
            }),
            transformResponse: (response: ResultEnvelope<Department | null>) => ensureSuccess(response, { allowNullData: true }),
            invalidatesTags: (_result, _error, id) => [
                { type: "Department", id },
                { type: "Department", id: "LIST" }
            ]
        }),
        restoreDepartment: builder.mutation<ExtractedResult<null>, string>({
            query: (id) => ({
                url: `${DEPARTMENT_ENDPOINT}/${id}/restore`,
                method: "POST"
            }),
            transformResponse: (response: ResultEnvelope<null>) => ensureSuccess(response, { allowNullData: true }),
            invalidatesTags: (_result, _error, id) => [
                { type: "Department", id },
                { type: "Department", id: "LIST" }
            ]
        }),
        assignDepartmentSupervisor: builder.mutation<ExtractedResult<Department>, { departmentId: string; userId: string }>({
            query: ({ departmentId, userId }) => ({
                url: `${DEPARTMENT_ENDPOINT}/${departmentId}/supervisors`,
                method: "POST",
                body: { userId }
            }),
            transformResponse: (response: ResultEnvelope<Department>) => ensureSuccess(response),
            invalidatesTags: (_result, _error, { departmentId }) => [
                { type: "Department", id: departmentId },
                { type: "Department", id: "LIST" }
            ]
        }),
        removeDepartmentSupervisor: builder.mutation<ExtractedResult<Department>, { departmentId: string; userId: string }>({
            query: ({ departmentId, userId }) => ({
                url: `${DEPARTMENT_ENDPOINT}/${departmentId}/supervisors/${userId}`,
                method: "DELETE"
            }),
            transformResponse: (response: ResultEnvelope<Department>) => ensureSuccess(response),
            invalidatesTags: (_result, _error, { departmentId }) => [
                { type: "Department", id: departmentId },
                { type: "Department", id: "LIST" }
            ]
        })
    }),
    overrideExisting: false
});

export const {
    useGetDepartmentsQuery,
    useLazyGetDepartmentsQuery,
    useGetAllDepartmentsQuery,
    useGetDepartmentHierarchyQuery,
    useGetDepartmentByIdQuery,
    useCreateDepartmentMutation,
    useUpdateDepartmentMutation,
    useDeleteDepartmentMutation,
    useRestoreDepartmentMutation,
    useAssignDepartmentSupervisorMutation,
    useRemoveDepartmentSupervisorMutation
} = departmentApi;

export type { GetDepartmentsParams, GetDepartmentsResult };
