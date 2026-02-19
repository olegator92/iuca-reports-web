export {
    useGetRolesQuery,
    useGetRoleByIdQuery,
    useCreateRoleMutation,
    useUpdateRoleMutation,
    useDeleteRoleMutation,
    useAssignPermissionsMutation,
    useRemovePermissionMutation,
    useGetAllPermissionsQuery,
    useGetUserPermissionsQuery,
    useLazyGetUserPermissionsQuery,
    useGetRolePermissionsQuery
} from "./api";

export {
    roleReducer,
    setPage,
    setSearchQuery,
    setPageSize,
    resetRoleState
} from "./model";

export type {
    Role,
    RoleState,
    CreateRoleRequest,
    UpdateRoleRequest,
    AssignPermissionsRequest
} from "./model";

export { RoleCard } from "./ui";
