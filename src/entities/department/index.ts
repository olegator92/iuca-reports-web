export type {
    Department,
    CreateDepartmentDto,
    UpdateDepartmentDto,
    DepartmentListParams,
    DepartmentSortField,
    DepartmentState
} from "./model";

export {
    departmentReducer,
    setPage,
    setSearchQuery,
    setPageSize,
    setIncludeDeleted,
    setSortBy,
    setSortDescending,
    setSort,
    resetFilters
} from "./model";

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
    useRestoreDepartmentMutation
} from "./model";

export type { GetDepartmentsParams, GetDepartmentsResult } from "./api";
