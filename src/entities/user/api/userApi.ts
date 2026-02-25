import { toast } from "sonner";
import { ensureSuccess, rtkApi } from "@/shared/api";
import type { ExtractedResult, PaginatedResponse, ResultEnvelope } from "@/shared/api";
import type { User, CreateUserRequest, UpdateUserRequest, AssignRoleRequest, AssignPositionRequest } from "../model";

interface GetUsersParams {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    sortDescending?: boolean;
    email?: string;
    firstName?: string;
    lastName?: string;
    isActive?: boolean;
    roleName?: string;
}

interface GetUsersResult {
    data: User[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const USER_ENDPOINT = "/users";

const buildSearchParams = ({
    page = DEFAULT_PAGE,
    pageSize = DEFAULT_PAGE_SIZE,
    search,
    sortBy,
    sortDescending,
    email,
    firstName,
    lastName,
    isActive,
    roleName
}: GetUsersParams) => {
    const params: Record<string, string | number | boolean> = {
        Page: page,
        PageSize: pageSize
    };

    if (search && search.trim().length > 0) {
        params.Search = search.trim();
    }

    if (sortBy) {
        params.SortBy = sortBy;
    }

    if (sortDescending !== undefined) {
        params.SortDescending = sortDescending;
    }

    if (email && email.trim().length > 0) {
        params.Email = email.trim();
    }

    if (firstName && firstName.trim().length > 0) {
        params.FirstName = firstName.trim();
    }

    if (lastName && lastName.trim().length > 0) {
        params.LastName = lastName.trim();
    }

    if (isActive !== undefined && isActive !== null) {
        params.IsActive = isActive;
    }

    if (roleName && roleName.trim().length > 0) {
        params.RoleName = roleName.trim();
    }

    return params;
};

const showSuccessToast = (message?: string | null) => {
    if (typeof message === "string" && message.trim().length > 0) {
        toast.success(message);
    }
};

export const userApi = rtkApi.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query<GetUsersResult, GetUsersParams | void>({
            query: (args) => {
                const {
                    page = DEFAULT_PAGE,
                    pageSize = DEFAULT_PAGE_SIZE,
                    search,
                    sortBy,
                    sortDescending,
                    email,
                    firstName,
                    lastName,
                    isActive,
                    roleName
                } = args ?? {};
                return {
                    url: USER_ENDPOINT,
                    params: buildSearchParams({
                        page,
                        pageSize,
                        search,
                        sortBy,
                        sortDescending,
                        email,
                        firstName,
                        lastName,
                        isActive,
                        roleName
                    })
                };
            },
            transformResponse: (response: ResultEnvelope<PaginatedResponse<User>>, _meta, args) => {
                const { page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE } = args ?? {};
                const { data: payload } = ensureSuccess(response);

                const resolvedPage = payload.page ?? page;
                const resolvedPageSize = payload.pageSize ?? pageSize;
                const resolvedTotal = payload.totalCount ?? 0;
                const resolvedTotalPages = payload.totalPages ?? Math.max(1, Math.ceil(resolvedTotal / resolvedPageSize));

                return {
                    data: payload.data ?? [],
                    totalCount: resolvedTotal,
                    page: resolvedPage,
                    pageSize: resolvedPageSize,
                    totalPages: resolvedTotalPages,
                    hasPreviousPage: payload.hasPreviousPage ?? resolvedPage > 1,
                    hasNextPage: payload.hasNextPage ?? resolvedPage < resolvedTotalPages
                };
            },
            providesTags: (result) => {
                if (!result) {
                    return [{ type: "User" as const, id: "LIST" }];
                }

                const entityTags = result.data.map((user) => ({ type: "User" as const, id: user.id }));

                return [...entityTags, { type: "User" as const, id: "LIST" }];
            }
        }),
        getUserById: builder.query<User, string>({
            query: (id) => ({
                url: `${USER_ENDPOINT}/${id}`
            }),
            transformResponse: (response: ResultEnvelope<User>) => ensureSuccess(response).data,
            providesTags: (_result, _error, id) => [{ type: "User", id }]
        }),
        addUser: builder.mutation<ExtractedResult<User>, CreateUserRequest>({
            query: (user) => ({
                url: USER_ENDPOINT,
                method: "POST",
                body: user
            }),
            transformResponse: (response: ResultEnvelope<User>) => ensureSuccess(response),
            invalidatesTags: [{ type: "User", id: "LIST" }],
            async onQueryStarted(_arg, { queryFulfilled }) {
                try {
                    const { data: result } = await queryFulfilled;
                    showSuccessToast(result.message);
                } catch {
                    // Errors handled globally
                }
            }
        }),
        updateUser: builder.mutation<ExtractedResult<User>, { id: string } & UpdateUserRequest>({
            query: ({ id, ...user }) => ({
                url: `${USER_ENDPOINT}/${id}`,
                method: "PUT",
                body: user
            }),
            transformResponse: (response: ResultEnvelope<User>, _meta, args) => {
                const result = ensureSuccess(response, { allowNullData: true });
                const resolvedData = result.data ?? { ...args };
                return {
                    ...result,
                    data: resolvedData as User
                };
            },
            invalidatesTags: (_result, _error, args) => [
                { type: "User", id: args.id },
                { type: "User", id: "LIST" }
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
        deleteUser: builder.mutation<ExtractedResult<User | null>, string>({
            query: (id) => ({
                url: `${USER_ENDPOINT}/${id}`,
                method: "DELETE"
            }),
            transformResponse: (response: ResultEnvelope<User | null>) => ensureSuccess(response, { allowNullData: true }),
            invalidatesTags: (_result, _error, id) => [
                { type: "User", id },
                { type: "User", id: "LIST" }
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
        enableUser: builder.mutation<ExtractedResult<null>, string>({
            query: (id) => ({
                url: `${USER_ENDPOINT}/${id}/enable`,
                method: "POST"
            }),
            transformResponse: (response: ResultEnvelope<null>) => ensureSuccess(response, { allowNullData: true }),
            invalidatesTags: (_result, _error, id) => [
                { type: "User", id },
                { type: "User", id: "LIST" }
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
        disableUser: builder.mutation<ExtractedResult<null>, string>({
            query: (id) => ({
                url: `${USER_ENDPOINT}/${id}/disable`,
                method: "POST"
            }),
            transformResponse: (response: ResultEnvelope<null>) => ensureSuccess(response, { allowNullData: true }),
            invalidatesTags: (_result, _error, id) => [
                { type: "User", id },
                { type: "User", id: "LIST" }
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
        assignRoleToUser: builder.mutation<ExtractedResult<User>, AssignRoleRequest>({
            query: ({ userId, roleId }) => ({
                url: `${USER_ENDPOINT}/${userId}/roles`,
                method: "POST",
                body: { userId, roleId }
            }),
            transformResponse: (response: ResultEnvelope<User>) => ensureSuccess(response),
            async onQueryStarted({ userId }, { dispatch, queryFulfilled }) {
                try {
                    const { data: result } = await queryFulfilled;
                    showSuccessToast(result.message);

                    // Update the user in cached queries instead of invalidating
                    if (result.data) {
                        dispatch(
                            userApi.util.updateQueryData("getUserById", userId, () => result.data)
                        );
                    }
                } catch {
                    // Errors handled globally
                }
            }
        }),
        removeRoleFromUser: builder.mutation<ExtractedResult<User>, { userId: string; roleId: string }>({
            query: ({ userId, roleId }) => ({
                url: `${USER_ENDPOINT}/${userId}/roles/${roleId}`,
                method: "DELETE"
            }),
            transformResponse: (response: ResultEnvelope<User>) => ensureSuccess(response),
            async onQueryStarted({ userId }, { dispatch, queryFulfilled }) {
                try {
                    const { data: result } = await queryFulfilled;
                    showSuccessToast(result.message);

                    // Update the user in cached queries instead of invalidating
                    if (result.data) {
                        dispatch(
                            userApi.util.updateQueryData("getUserById", userId, () => result.data)
                        );
                    }
                } catch {
                    // Errors handled globally
                }
            }
        }),
        assignPositionToUser: builder.mutation<ExtractedResult<User>, AssignPositionRequest>({
            query: ({ userId, positionId }) => ({
                url: `${USER_ENDPOINT}/${userId}/positions`,
                method: "POST",
                body: { userId, positionId }
            }),
            transformResponse: (response: ResultEnvelope<User>) => ensureSuccess(response),
            async onQueryStarted({ userId }, { dispatch, queryFulfilled }) {
                try {
                    const { data: result } = await queryFulfilled;
                    showSuccessToast(result.message);

                    // Update the user in cached queries instead of invalidating
                    if (result.data) {
                        dispatch(
                            userApi.util.updateQueryData("getUserById", userId, () => result.data)
                        );
                    }
                } catch {
                    // Errors handled globally
                }
            }
        }),
        removePositionFromUser: builder.mutation<ExtractedResult<User>, { userId: string; positionId: string }>({
            query: ({ userId, positionId }) => ({
                url: `${USER_ENDPOINT}/${userId}/positions/${positionId}`,
                method: "DELETE"
            }),
            transformResponse: (response: ResultEnvelope<User>) => ensureSuccess(response),
            async onQueryStarted({ userId }, { dispatch, queryFulfilled }) {
                try {
                    const { data: result } = await queryFulfilled;
                    showSuccessToast(result.message);

                    // Update the user in cached queries instead of invalidating
                    if (result.data) {
                        dispatch(
                            userApi.util.updateQueryData("getUserById", userId, () => result.data)
                        );
                    }
                } catch {
                    // Errors handled globally
                }
            }
        }),
        getUserPermissions: builder.query<string[], string>({
            query: (userId) => ({
                url: `/permissions/users/${userId}`
            }),
            transformResponse: (response: ResultEnvelope<string[]>) => ensureSuccess(response).data,
            providesTags: (_result, _error, userId) => [{ type: "User", id: `${userId}-permissions` }]
        }),
        getAllUsers: builder.query<User[], void>({
            query: () => ({
                url: `${USER_ENDPOINT}/all`
            }),
            transformResponse: (response: ResultEnvelope<User[]>) => {
                const { data } = ensureSuccess(response);
                return data ?? [];
            },
            providesTags: [{ type: "User" as const, id: "LIST" }]
        })
    }),
    overrideExisting: false
});

export const {
    useGetUsersQuery,
    useLazyGetUsersQuery,
    useGetUserByIdQuery,
    useAddUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useEnableUserMutation,
    useDisableUserMutation,
    useAssignRoleToUserMutation,
    useRemoveRoleFromUserMutation,
    useAssignPositionToUserMutation,
    useRemovePositionFromUserMutation,
    useGetUserPermissionsQuery,
    useGetAllUsersQuery
} = userApi;

export type { GetUsersParams, GetUsersResult };
