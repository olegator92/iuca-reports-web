export {
    userApi,
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
} from "./userApi";

export type { GetUsersParams, GetUsersResult } from "./userApi";

export type { User } from "../model";
