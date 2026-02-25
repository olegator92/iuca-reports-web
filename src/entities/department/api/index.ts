export {
    departmentApi,
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
} from "./departmentApi";
export type { GetDepartmentsParams, GetDepartmentsResult } from "./departmentApi";
