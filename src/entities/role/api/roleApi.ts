import { rtkApi, ensureSuccess } from "@/shared/api";
import type { ResultEnvelope } from "@/shared/api";
import type {
    Role,
    CreateRoleRequest,
    UpdateRoleRequest,
    AssignPermissionsRequest
} from "../model/types";

const ROLES_ENDPOINT = "/roles";

export const roleApi = rtkApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all roles with their permissions
        getRoles: builder.query<Role[], void>({
            query: () => ({
                url: ROLES_ENDPOINT,
                method: "GET"
            }),
            transformResponse: (response: ResultEnvelope<Role[]>) => {
                const result = ensureSuccess(response);
                return result.data || [];
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: "Role" as const, id })),
                        { type: "Role", id: "LIST" }
                    ]
                    : [{ type: "Role", id: "LIST" }]
        }),

        // Get specific role by ID
        getRoleById: builder.query<Role, string>({
            query: (id) => ({
                url: `${ROLES_ENDPOINT}/${id}`,
                method: "GET"
            }),
            transformResponse: (response: ResultEnvelope<Role>) => {
                return ensureSuccess(response).data;
            },
            providesTags: (_result, _error, id) => [{ type: "Role", id }]
        }),

        // Create new role
        createRole: builder.mutation<{ role: Role; message?: string }, CreateRoleRequest>({
            query: (body) => ({
                url: ROLES_ENDPOINT,
                method: "POST",
                body
            }),
            transformResponse: (response: ResultEnvelope<Role>) => {
                const result = ensureSuccess(response);
                return { role: result.data, message: result.message || undefined };
            },
            invalidatesTags: [{ type: "Role", id: "LIST" }]
        }),

        // Update existing role
        updateRole: builder.mutation<{ role: Role; message?: string }, { id: string; body: UpdateRoleRequest }>({
            query: ({ id, body }) => ({
                url: `${ROLES_ENDPOINT}/${id}`,
                method: "PUT",
                body
            }),
            transformResponse: (response: ResultEnvelope<Role>) => {
                const result = ensureSuccess(response);
                return { role: result.data, message: result.message || undefined };
            },
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Role", id },
                { type: "Role", id: "LIST" }
            ]
        }),

        // Delete a role
        deleteRole: builder.mutation<{ message?: string }, string>({
            query: (id) => ({
                url: `${ROLES_ENDPOINT}/${id}`,
                method: "DELETE"
            }),
            transformResponse: (response: ResultEnvelope<null>) => {
                const result = ensureSuccess(response, { allowNullData: true });
                return { message: result.message || undefined };
            },
            invalidatesTags: (_result, _error, id) => [
                { type: "Role", id },
                { type: "Role", id: "LIST" }
            ]
        }),

        // Assign multiple permissions to a role
        assignPermissions: builder.mutation<void, { id: string; body: AssignPermissionsRequest }>({
            query: ({ id, body }) => ({
                url: `${ROLES_ENDPOINT}/${id}/permissions`,
                method: "POST",
                body
            }),
            transformResponse: (response: ResultEnvelope<null>) => {
                ensureSuccess(response, { allowNullData: true });
            },
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Role", id },
                { type: "Role", id: "LIST" },
                { type: "Permission", id: `ROLE_${id}` },
                // Invalidate all user permissions since any user with this role is affected
                { type: "Permission", id: "LIST" }
            ]
        }),

        // Remove specific permission from a role
        removePermission: builder.mutation<void, { id: string; permission: string }>({
            query: ({ id, permission }) => ({
                url: `${ROLES_ENDPOINT}/${id}/permissions/${encodeURIComponent(permission)}`,
                method: "DELETE"
            }),
            transformResponse: (response: ResultEnvelope<null>) => {
                ensureSuccess(response, { allowNullData: true });
            },
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Role", id },
                { type: "Role", id: "LIST" },
                { type: "Permission", id: `ROLE_${id}` },
                // Invalidate all user permissions since any user with this role is affected
                { type: "Permission", id: "LIST" }
            ]
        })
    }),
    overrideExisting: false
});

export const {
    useGetRolesQuery,
    useGetRoleByIdQuery,
    useCreateRoleMutation,
    useUpdateRoleMutation,
    useDeleteRoleMutation,
    useAssignPermissionsMutation,
    useRemovePermissionMutation
} = roleApi;
