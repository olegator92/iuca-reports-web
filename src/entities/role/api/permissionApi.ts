import { rtkApi, ensureSuccess } from "@/shared/api";
import type { ResultEnvelope } from "@/shared/api";

const PERMISSIONS_ENDPOINT = "/permissions";

export const permissionApi = rtkApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all available permissions in the system
        getAllPermissions: builder.query<string[], void>({
            query: () => ({
                url: PERMISSIONS_ENDPOINT,
                method: "GET"
            }),
            transformResponse: (response: ResultEnvelope<string[]>) => {
                const result = ensureSuccess(response);
                return result.data || [];
            },
            providesTags: [{ type: "Permission", id: "LIST" }]
        }),

        // Get all permissions for a specific user (aggregated from roles)
        getUserPermissions: builder.query<string[], string>({
            query: (userId) => ({
                url: `${PERMISSIONS_ENDPOINT}/users/${userId}`,
                method: "GET"
            }),
            transformResponse: (response: ResultEnvelope<string[]>) => {
                const result = ensureSuccess(response);
                return result.data || [];
            },
            providesTags: (_result, _error, userId) => [
                { type: "Permission", id: `USER_${userId}` }
            ]
        }),

        // Get all permissions for a specific role
        getRolePermissions: builder.query<string[], string>({
            query: (roleId) => ({
                url: `${PERMISSIONS_ENDPOINT}/roles/${roleId}`,
                method: "GET"
            }),
            transformResponse: (response: ResultEnvelope<string[]>) => {
                const result = ensureSuccess(response);
                return result.data || [];
            },
            providesTags: (_result, _error, roleId) => [
                { type: "Permission", id: `ROLE_${roleId}` },
                { type: "Role", id: roleId }
            ]
        })
    }),
    overrideExisting: false
});

export const {
    useGetAllPermissionsQuery,
    useGetUserPermissionsQuery,
    useLazyGetUserPermissionsQuery,
    useGetRolePermissionsQuery
} = permissionApi;
