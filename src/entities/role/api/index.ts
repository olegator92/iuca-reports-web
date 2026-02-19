export {
    roleApi,
    useGetRolesQuery,
    useGetRoleByIdQuery,
    useCreateRoleMutation,
    useUpdateRoleMutation,
    useDeleteRoleMutation,
    useAssignPermissionsMutation,
    useRemovePermissionMutation
} from "./roleApi";

export {
    permissionApi,
    useGetAllPermissionsQuery,
    useGetUserPermissionsQuery,
    useLazyGetUserPermissionsQuery,
    useGetRolePermissionsQuery
} from "./permissionApi";
